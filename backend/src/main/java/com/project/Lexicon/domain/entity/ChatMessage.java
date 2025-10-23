package com.project.Lexicon.domain.entity;

import com.project.Lexicon.domain.ChatRole;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chat_message")
public class ChatMessage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @Enumerated(EnumType.STRING)
    private ChatRole role;

    @Lob
    private String content;

    private Instant timestamp;

    @Column(name = "thread_id")
    private String threadId; // optional
}
