package com.project.Lexicon.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "quiz_submission")
public class QuizSubmission {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    private Integer total;
    private Integer correct;
    private Integer score; // 0-100
    private Boolean passed;
    private Integer pointsAwarded; // optional

    private Instant createdAt;
}
