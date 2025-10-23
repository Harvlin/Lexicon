package com.project.Lexicon.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notification_preferences")
public class NotificationPreferences {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    private boolean emailNotifications;
    private boolean pushNotifications;
    private boolean weeklyDigest;
    private boolean marketingEmails;

    private Instant createdAt;
    private Instant updatedAt;
}
