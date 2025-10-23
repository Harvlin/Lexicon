package com.project.Lexicon.domain.entity;

import com.project.Lexicon.domain.ScheduleSource;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "schedule_week", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","week_id"}))
public class ScheduleWeek {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "week_id", nullable = false)
    private String weekId; // e.g. 2025-W43

    @Enumerated(EnumType.STRING)
    private ScheduleSource source;

    @OneToMany(mappedBy = "week", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ScheduleSession> sessions = new ArrayList<>();

    private Instant createdAt;
    private Instant updatedAt;
}
