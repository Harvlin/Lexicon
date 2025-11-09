package com.project.Lexicon.service.impl;

import com.project.Lexicon.domain.entity.Lesson;
import com.project.Lexicon.repository.LessonRepository;
import com.project.Lexicon.service.LessonService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@Slf4j
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;

    @Autowired
    public LessonServiceImpl(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    @Override
    public Lesson getLesson(Long id) {
        return lessonRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Lesson not found with id " + id)
        );
    }

    @Override
    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    @Override
    public Lesson createLesson(Lesson lesson) {
        return null;
    }

    @Override
    public Lesson updateLesson(Long id, Lesson lesson) {
        return null;
    }

    @Override
    public void deleteLesson(Long id) {

    }
}
