package com.project.Lexicon.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_badge")
public class UserBadge {
    @EmbeddedId
    private UserBadgeId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("badgeId")
    @JoinColumn(name = "badge_id")
    private Badge badge;

    private Instant awardedAt;
}
