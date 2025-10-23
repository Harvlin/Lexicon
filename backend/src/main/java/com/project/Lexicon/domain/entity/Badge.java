package com.project.Lexicon.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String icon;

    @Column(columnDefinition = "TEXT")
    private String criteriaJson;

    private java.time.Instant createdAt;
    private java.time.Instant updatedAt;
}
