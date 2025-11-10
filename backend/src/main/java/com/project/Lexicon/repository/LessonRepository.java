package com.project.Lexicon.repository;

import com.project.Lexicon.domain.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    // Built-in count() method from JpaRepository is sufficient
}
