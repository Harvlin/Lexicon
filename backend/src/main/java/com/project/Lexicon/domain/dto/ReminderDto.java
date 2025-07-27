package com.project.Lexicon.domain.dto;

import java.time.LocalDateTime;

public class ReminderDto {

    Long id;
    UserDto user;
    LessonDto lesson;
    LocalDateTime remindAt;
    Boolean sent;
}
