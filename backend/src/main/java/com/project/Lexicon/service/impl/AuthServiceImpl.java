package com.project.Lexicon.service.impl;

import com.project.Lexicon.domain.dto.security.AuthResponse;
import com.project.Lexicon.domain.dto.security.LoginDto;
import com.project.Lexicon.domain.dto.security.RegisterDto;
import com.project.Lexicon.domain.entity.User;
import com.project.Lexicon.repository.UserRepository;
import com.project.Lexicon.security.JwtUtil;
import com.project.Lexicon.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.naming.AuthenticationException;
import java.util.ArrayList;

@Service
@Transactional
@Slf4j
public class AuthServiceImpl implements AuthService {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtUtil jwtUtil;
    private AuthenticationManager authenticationManager;

    @Autowired
    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public String register(RegisterDto dto) {
        // Check if user already exists
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail().toLowerCase())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(dto.getRole())
                .goals(dto.getGoals() != null ? dto.getGoals() : new ArrayList<>())
                .isActive(true)
                .build();

        userRepository.save(user);
        log.info("User registered: {}", user.getEmail());

        return "User registered successfully";
    }

    @Override
    public AuthResponse login(LoginDto dto) {
        try {
            // Authenticate user
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            dto.getEmail().toLowerCase(),
                            dto.getPassword()
                    )
            );

            // Get user details
            User user = userRepository.findByEmailAndIsActiveTrue(dto.getEmail().toLowerCase())
                    .orElseThrow(() -> new AuthenticationException("User not found or inactive"));

            // Generate JWT
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());

            return new AuthResponse(
                    token,
                    user.getName(),
                    user.getEmail(),
                    user.getRole(),
                    String.join(",", user.getGoals())
            );
        } catch (AuthenticationException e) {
            log.warn("Login failed for {}: {}", dto.getEmail(), e.getMessage());
            throw new RuntimeException("Invalid email or password");
        }
    }

    @Override
    public AuthResponse getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponse(
                null, // Don't return token in /me endpoint
                user.getName(),
                user.getEmail(),
                user.getRole(),
                String.join(",", user.getGoals())
        );
    }

    @Override
    public void changePassword(String currentPassword, String newPassword) {
        String email = (String) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        User user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
