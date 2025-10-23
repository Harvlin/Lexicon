package com.project.Lexicon.config;

import com.project.Lexicon.security.JwtAuthEntryPoint;
import com.project.Lexicon.security.JwtAuthFilter;
import com.project.Lexicon.service.impl.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandlerImpl;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    private JwtAuthFilter jwtAuthFilter;
    private UserDetailsServiceImpl userDetailsService;
    private JwtAuthEntryPoint jwtAuthEntryPoint;

    @Autowired
    public SecurityConfig(JwtAuthFilter jwtAuthFilter, UserDetailsServiceImpl userDetailsService, JwtAuthEntryPoint jwtAuthEntryPoint) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
        this.jwtAuthEntryPoint = jwtAuthEntryPoint;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/lessons/**").hasAnyRole("STUDENT", "PROFESSIONAL", "EDUCATOR", "ADMIN", "USER")
                        .requestMatchers("/api/quiz/**").hasAnyRole("STUDENT", "PROFESSIONAL", "EDUCATOR", "ADMIN", "USER")
                        .requestMatchers("/api/flashcards/**").hasAnyRole("STUDENT", "PROFESSIONAL", "EDUCATOR", "ADMIN", "USER")
                        .requestMatchers("/api/progress/**").hasAnyRole("STUDENT", "PROFESSIONAL", "EDUCATOR", "ADMIN", "USER")
                        .anyRequest().authenticated()
                );
        http.exceptionHandling(ex -> ex
                .authenticationEntryPoint(jwtAuthEntryPoint)
                .accessDeniedHandler(new AccessDeniedHandlerImpl())
        );

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    // Allow local dev frontends (Vite/React) and add more as needed
    configuration.setAllowedOrigins(Arrays.asList(
        // Local dev
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        // LAN dev (accessing Vite via local network)
        "http://10.189.253.238:5173",
        "http://10.189.253.238:4173",
        // Vercel production/custom domains
        "https://lexigrain.vercel.app",
        "https://lexigrain-4l9dtj20z-harvlins-projects.vercel.app"
    ));
    // Also allow other Vercel preview deployments via pattern matching
    configuration.setAllowedOriginPatterns(Arrays.asList("https://*.vercel.app"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
    configuration.setExposedHeaders(Arrays.asList("Authorization"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}