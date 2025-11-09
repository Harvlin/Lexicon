package com.project.Lexicon.repository;

import com.project.Lexicon.domain.entity.ScheduleWeek;
import com.project.Lexicon.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScheduleWeekRepository extends JpaRepository<ScheduleWeek, Long> {
    Optional<ScheduleWeek> findByUserAndWeekId(User user, String weekId);
}