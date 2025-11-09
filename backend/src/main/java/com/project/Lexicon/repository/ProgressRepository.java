package com.project.Lexicon.repository;

import com.project.Lexicon.domain.ProgressStatus;
import com.project.Lexicon.domain.entity.Progress;
import com.project.Lexicon.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {

    long countByUserAndStatus(User user, ProgressStatus status);

    List<Progress> findByUserAndStatus(User user, ProgressStatus status);

    Optional<Progress> findByUserAndLesson_Id(User user, Long lessonId);

    @Query("SELECT p FROM Progress p JOIN FETCH p.lesson WHERE p.user = :user")
    List<Progress> findAllByUserWithLessons(@Param("user") User user);
}