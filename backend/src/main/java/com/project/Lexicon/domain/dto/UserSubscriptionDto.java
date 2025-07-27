package com.project.Lexicon.domain.dto;

import com.project.Lexicon.domain.SubscriptionStatus;

import java.time.Instant;

public class UserSubscriptionDto {

    UserSubscriptionIdDto id;
    Instant startedAt;
    Instant expiresAt;
    SubscriptionStatus status;
}
