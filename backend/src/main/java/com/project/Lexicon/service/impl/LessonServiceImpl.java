package com.project.Lexicon.service.impl;

import com.project.Lexicon.domain.ProgressStatus;
import com.project.Lexicon.domain.entity.Lesson;
import com.project.Lexicon.domain.entity.Progress;
import com.project.Lexicon.domain.entity.User;
import com.project.Lexicon.repository.LessonRepository;
import com.project.Lexicon.repository.ProgressRepository;
import com.project.Lexicon.service.LessonService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final ProgressRepository progressRepository;

    @Autowired
    public LessonServiceImpl(LessonRepository lessonRepository, ProgressRepository progressRepository) {
        this.lessonRepository = lessonRepository;
        this.progressRepository = progressRepository;
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
        return lessonRepository.save(lesson);
    }

    @Override
    public Lesson updateLesson(Long id, Lesson lesson) {
        Lesson existingLesson = getLesson(id);
        // Update fields
        existingLesson.setTitle(lesson.getTitle());
        existingLesson.setDescription(lesson.getDescription());
        existingLesson.setType(lesson.getType());
        existingLesson.setLevel(lesson.getLevel());
        existingLesson.setCategory(lesson.getCategory());
        existingLesson.setDuration(lesson.getDuration());
        existingLesson.setThumbnail(lesson.getThumbnail());
        existingLesson.setVideoUrl(lesson.getVideoUrl());
        existingLesson.setContentUrl(lesson.getContentUrl());
        existingLesson.setTags(lesson.getTags());
        return lessonRepository.save(existingLesson);
    }

    @Override
    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }

    @Override
    public List<Progress> getCompletedLessons(User user, int limit) {
        log.debug("Fetching completed lessons for user: {}, limit: {}", user.getEmail(), limit);
        return progressRepository.findByUserAndStatus(user, ProgressStatus.COMPLETED)
                .stream()
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public List<Progress> getInProgressLessons(User user, int limit) {
        log.debug("Fetching in-progress lessons for user: {}, limit: {}", user.getEmail(), limit);
        return progressRepository.findByUserAndStatus(user, ProgressStatus.IN_PROGRESS)
                .stream()
                .limit(limit)
                .collect(Collectors.toList());
    }
}
