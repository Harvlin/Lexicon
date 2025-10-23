package com.project.Lexicon.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "onboarding_profile")
public class OnboardingProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Lob
    private String goalsJson; // array of strings

    @Lob
    private String skillsJson; // array of strings

    private double dailyHours; // supports 0.5 steps

    private String schedulePreset; // Morning/Afternoon/Evening/Late Night/Custom

    @Lob
    private String daysOfWeekJson; // array of Mon..Sun

    private String specificTime; // HH:mm

    private boolean reminderEnabled;

    private Instant completedAt;

    private Instant createdAt;
    private Instant updatedAt;
}
