package com.project.Lexicon.domain.dto.security;

import com.project.Lexicon.domain.Role;
import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDto {

    @NotNull(message = "Name is required")
    private String name;

    @Email(message = "Valid email is required")
    @NotNull(message = "Email is required")
    private String email;

    @NotNull(message = "Password is required")
    private String password;

    // Optional during initial signup; defaults to USER server-side
    private Role role;

    // Optional during initial signup; can be filled in onboarding
    private List<@NotBlank(message = "Each goal must be non-blank") String> goals;
}