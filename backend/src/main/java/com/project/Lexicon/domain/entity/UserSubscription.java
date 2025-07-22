package com.project.Lexicon.domain.entity;

import com.project.Lexicon.domain.SubscriptionStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSubscription {
    @EmbeddedId
    private UserSubscriptionId id;

    private Instant startedAt;
    private Instant expiresAt;

    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status;
}
