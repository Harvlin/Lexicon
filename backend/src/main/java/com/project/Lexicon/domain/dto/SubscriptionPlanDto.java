package com.project.Lexicon.domain.dto;

import java.time.Instant;

public class SubscriptionPlanDto {

    Long id;
    String name;
    Integer priceMonthly;
    String featuresJson;
    Instant createdAt;
}
