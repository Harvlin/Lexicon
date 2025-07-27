package com.project.Lexicon.domain.dto;

import java.time.LocalDateTime;

public class QuizDto {

    Long id;
    LessonDto lesson;
    String questionsJson;
    LocalDateTime createdAt;
}
