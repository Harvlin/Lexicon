package com.project.Lexicon.service;

import com.project.Lexicon.domain.entity.Lesson;
import com.project.Lexicon.domain.entity.Progress;
import com.project.Lexicon.domain.entity.User;

import java.util.List;

public interface LessonService {
    Lesson getLesson(Long id);
    List<Lesson> getAllLessons();
    Lesson createLesson(Lesson lesson);
    Lesson updateLesson(Long id, Lesson lesson);
    void deleteLesson(Long id);
    List<Progress> getCompletedLessons(User user, int limit);
    List<Progress> getInProgressLessons(User user, int limit);
}
