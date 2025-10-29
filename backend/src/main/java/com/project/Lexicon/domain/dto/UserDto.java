package com.project.Lexicon.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.Lexicon.domain.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    Long id;
    String name;
    String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    String password;
    String bio;
    Role role;
    List<String> goals;
    String avatarUrl;
    LocalDateTime joined;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isActive;
}
