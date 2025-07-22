package com.project.Lexicon.domain.entity;

import com.project.Lexicon.domain.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String password;
    private Role role;

    @ElementCollection
    @CollectionTable(name = "user_goals", joinColumns = @JoinColumn(name = "user_id"))
    private List<String> goals;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
