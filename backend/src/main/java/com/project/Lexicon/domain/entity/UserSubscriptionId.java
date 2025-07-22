package com.project.Lexicon.domain.entity;

import jakarta.persistence.Embeddable;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSubscriptionId implements Serializable {
    private Long userId;
    private Long planId;
}
