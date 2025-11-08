package com.project.Lexicon.repository;

import com.project.Lexicon.domain.entity.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    List<Flashcard> findByVideoId(Long videoId);
    List<Flashcard> findByVideoIdOrderByCardNumberAsc(Long videoId);
}
