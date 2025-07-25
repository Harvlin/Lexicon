package com.project.Lexicon.service;

import com.project.Lexicon.domain.dto.AuthResponse;
import com.project.Lexicon.domain.dto.LoginDto;
import com.project.Lexicon.domain.dto.RegisterDto;

public interface AuthService {
    String register(RegisterDto registerDto);
    AuthResponse login(LoginDto loginDto);
    AuthResponse getCurrentUser();
    void changePassword(String oldPassword, String newPassword);
}
