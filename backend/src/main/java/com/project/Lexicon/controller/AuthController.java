package com.project.Lexicon.controller;

import com.project.Lexicon.annotations.RateLimit;
import com.project.Lexicon.domain.dto.MessageResponse;
import com.project.Lexicon.domain.dto.security.*;
import com.project.Lexicon.service.AuthService;
import jakarta.validation.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Validated
@Slf4j
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    @RateLimit(key = "register", limit = 5, duration = 300) // 5 attempts per 5 minutes
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDto dto) {
        try {
            String result = authService.register(dto);
            log.info("User registered successfully: {}", dto.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new MessageResponse(result));
        } catch (ValidationException e) {
            log.warn("Registration validation failed for {}: {}", dto.getEmail(), e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Invalid input: " + e.getMessage()));
        } catch (RuntimeException e) {
            log.warn("Registration failed for {}: {}", dto.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during registration for {}: {}", dto.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Registration failed. Please try again."));
        }
    }

    @PostMapping("/login")
    @RateLimit(key = "login", limit = 5, duration = 600) // 5 attempts per 5 minutes
    public ResponseEntity<?> login(@Valid @RequestBody LoginDto dto) {
        try {
            AuthResponse response = authService.login(dto);
            log.info("User logged in successfully: {}", dto.getEmail());
            return ResponseEntity.ok(response);
        } catch (org.springframework.security.core.AuthenticationException e) {
            log.warn("Authentication failed for {}: {}", dto.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Invalid email or password"));
        } catch (RuntimeException e) {
            log.warn("Login failed for {}: {}", dto.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Invalid email or password"));
        } catch (Exception e) {
            log.error("Unexpected error during login for {}: {}", dto.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Login failed. Please try again."));
        }
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuthResponse> getCurrentUser() {
        try {
            AuthResponse response = authService.getCurrentUser();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting current user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDto dto) {
        try {
            authService.changePassword(dto.getCurrentPassword(), dto.getNewPassword());
            return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}
