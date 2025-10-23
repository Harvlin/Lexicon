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
    @Column(columnDefinition = "TEXT")
    private String description;
    @Enumerated(EnumType.STRING)
    private Type type;

    @Enumerated(EnumType.STRING)
    private Level level;
    private String category;
    // Legacy content URL (keep for compatibility)
    private String contentUrl;
    // Video lessons URL exposed to frontend as LessonDTO.videoUrl
    private String videoUrl;
    private Integer duration;
    private String thumbnail;

    @ElementCollection
    @CollectionTable(name = "lesson_tags", joinColumns = @JoinColumn(name = "lesson_id"))
    @Column(name = "tag")
    private List<String> tags;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
