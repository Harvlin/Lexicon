package com.project.Lexicon.security;

import com.project.Lexicon.service.impl.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private JwtUtil jwtUtil;
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    public JwtAuthFilter(JwtUtil jwtUtil, UserDetailsServiceImpl userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        // Skip JWT parsing only for public auth endpoints (login/register);
        // other auth endpoints like /api/auth/me or /api/auth/change-password require authentication
        String uri = request.getRequestURI();
        String method = request.getMethod();
        if (uri != null) {
            boolean isLogin = "/api/auth/login".equals(uri) && "POST".equalsIgnoreCase(method);
            boolean isRegister = "/api/auth/register".equals(uri) && "POST".equalsIgnoreCase(method);
            if (isLogin || isRegister) {
                chain.doFilter(request, response);
                return;
            }
        }

        String header = request.getHeader("Authorization");
        String token = null;
        String email = null;

        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
            try {
                email = jwtUtil.getEmailFromToken(token);
            } catch (Exception e) {
                // Reduce log level to debug to prevent error spam on expired/invalid tokens
                logger.debug("JWT token parsing issue: " + e.getMessage());
            }
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            if (jwtUtil.validateToken(token)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(email, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        chain.doFilter(request, response);
    }
}