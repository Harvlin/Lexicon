package com.project.Lexicon.service;

import com.project.Lexicon.domain.dto.security.AuthResponse;
import com.project.Lexicon.domain.dto.security.LoginDto;
import com.project.Lexicon.domain.dto.security.RegisterDto;

public interface AuthService {
    String register(RegisterDto registerDto);
    AuthResponse login(LoginDto loginDto);
    AuthResponse getCurrentUser();
    void changePassword(String oldPassword, String newPassword);
}
