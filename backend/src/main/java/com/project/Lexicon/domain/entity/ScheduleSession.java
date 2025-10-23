package com.project.Lexicon.domain.entity;

import com.project.Lexicon.domain.SessionStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "schedule_session")
public class ScheduleSession {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "week_id_fk")
    private ScheduleWeek week;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    private LocalDate date; // yyyy-MM-dd
    private Integer plannedMinutes;
    private Integer actualMinutes; // nullable

    @Enumerated(EnumType.STRING)
    private SessionStatus status;

    private String focusTag; // optional

    private Instant createdAt;
    private Instant updatedAt;
}
