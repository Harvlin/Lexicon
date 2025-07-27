package com.project.Lexicon.domain.dto;

import com.project.Lexicon.domain.Level;
import com.project.Lexicon.domain.Type;

import java.time.LocalDateTime;
import java.util.List;

public class LessonDto {

    Long id;
    String title;
    Type type;
    Level level;
    String contentUrl;
    Integer duration;
    List<String> topics;
    LocalDateTime createdAt;
}