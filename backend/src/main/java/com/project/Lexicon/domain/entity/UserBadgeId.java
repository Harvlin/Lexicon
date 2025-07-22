package com.project.Lexicon.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBadgeId implements Serializable {
    private Long userId;
    private Long badgeId;
}
