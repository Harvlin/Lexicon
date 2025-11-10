package com.project.Lexicon.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Tracks user favorites for both lessons and study videos
 * Uses nullable foreign keys for minimal schema changes
 */
@Entity
@Table(name = "user_favorites", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "lesson_id"}),
    @UniqueConstraint(columnNames = {"user_id", "video_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserFavorite {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_id")
    private Video video;
    
    private Instant favoritedAt;
    
    @PrePersist
    protected void onCreate() {
        favoritedAt = Instant.now();
    }
}
