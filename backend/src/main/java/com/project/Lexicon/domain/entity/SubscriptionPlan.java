package com.project.Lexicon.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPlan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Integer priceMonthly;

    @Column(columnDefinition = "TEXT")
    private String featuresJson;
    private Instant createdAt;
}
