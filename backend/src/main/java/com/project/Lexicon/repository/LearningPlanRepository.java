package com.project.Lexicon.repository;

import com.project.Lexicon.domain.entity.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
    List<LearningPlan> findByUserId(Long userId);
    List<LearningPlan> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<LearningPlan> findByUserIdAndTopic(Long userId, String topic);
}
