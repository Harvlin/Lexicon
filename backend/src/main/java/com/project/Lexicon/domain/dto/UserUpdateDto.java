package com.project.Lexicon.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateDto {
    private String name;
    private String email;
    private String bio;
    private String avatarUrl;
    private LocalDateTime createdAt;
}
