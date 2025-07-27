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
}
