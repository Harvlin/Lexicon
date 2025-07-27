package com.project.Lexicon.domain.dto;

import com.project.Lexicon.domain.ProgressStatus;

import java.time.Instant;

public class ProgressDto {

    Long id;
    UserDto user;
    LessonDto lesson;
    ProgressStatus status;
    Instant completedAt;
}
