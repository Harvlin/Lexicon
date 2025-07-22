package com.project.Lexicon.domain.entity;

import com.project.Lexicon.domain.Level;
import com.project.Lexicon.domain.Type;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Enumerated(EnumType.STRING)
    private Type type;

    @Enumerated(EnumType.STRING)
    private Level level;
    private String contentUrl;
    private Integer duration;

    @ElementCollection
    @CollectionTable(name = "lesson_topics", joinColumns = @JoinColumn(name = "lesson_id"))
    @Column(name = "topic")
    private List<String> topics;

    private LocalDateTime createdAt;
}
