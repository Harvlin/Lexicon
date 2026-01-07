package com.project.Lexicon.domain.dto.security;

import com.project.Lexicon.domain.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String name;
    private String email;
    private Role role;
    private String goals;
    private String avatarUrl;

    // Constructor without avatarUrl for backward compatibility
    public AuthResponse(String token, String name, String email, Role role, String goals) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.role = role;
        this.goals = goals;
        this.avatarUrl = null;
    }
}
