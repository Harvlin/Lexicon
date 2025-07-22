package com.project.Lexicon.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBadge {
    @EmbeddedId
    private UserBadgeId id;
    private LocalDateTime awardedAt;
}
