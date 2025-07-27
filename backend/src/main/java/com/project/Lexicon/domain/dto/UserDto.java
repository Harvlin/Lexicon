package com.project.Lexicon.domain.dto;

import com.project.Lexicon.domain.Role;

import java.time.LocalDateTime;
import java.util.List;

public class UserDto {

    Long id;
    String name;
    String email;
    String password;
    Role role;
    List<String> goals;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isActive;
}
