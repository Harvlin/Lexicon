package com.project.Lexicon.service;

import com.project.Lexicon.domain.entity.Lesson;

import java.util.List;

public interface LessonService {
    Lesson getLesson(Long id);
    List<Lesson> getAllLessons();
    Lesson createLesson(Lesson lesson);
    Lesson updateLesson(Long id, Lesson lesson);
    void deleteLesson(Long id);
}
