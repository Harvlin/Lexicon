package com.project.Lexicon.repository;

import com.project.Lexicon.domain.entity.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    List<QuizQuestion> findByVideoId(Long videoId);
    List<QuizQuestion> findByVideoIdOrderByQuestionNumberAsc(Long videoId);
}
