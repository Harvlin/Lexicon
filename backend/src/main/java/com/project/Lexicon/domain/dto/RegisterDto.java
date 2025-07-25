package com.project.Lexicon.domain.dto;

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

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Role is required")
    private Role role;

    @NotNull(message = "Goals list is required")
    private List<@NotBlank(message = "Each goal must be non-blank") String> goals;


}