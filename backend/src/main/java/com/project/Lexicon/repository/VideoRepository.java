package com.project.Lexicon.repository;

import com.project.Lexicon.domain.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByUserId(Long userId);
    List<Video> findByUserIdAndTopic(Long userId, String topic);
    Optional<Video> findByVideoIdAndUserId(String videoId, Long userId);
}