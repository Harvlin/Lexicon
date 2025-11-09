package com.project.Lexicon.repository;

import com.project.Lexicon.domain.SessionStatus;
import com.project.Lexicon.domain.entity.ScheduleSession;
import com.project.Lexicon.domain.entity.ScheduleWeek;
import com.project.Lexicon.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleWeekRepository extends JpaRepository<ScheduleWeek, Long> {

    Optional<ScheduleWeek> findByUserAndWeekId(User user, String weekId);

    @Query("SELECT s FROM ScheduleSession s " +
            "WHERE s.week.user = :user " +
            "AND s.status = :status " +
            "AND s.date BETWEEN :startDate AND :endDate " +
            "ORDER BY s.date ASC")
    List<ScheduleSession> findSessionsByUserAndStatusAndDateBetween(
            @Param("user") User user,
            @Param("status") SessionStatus status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT COALESCE(SUM(s.actualMinutes), 0) " +
            "FROM ScheduleSession s " +
            "WHERE s.week.user = :user " +
            "AND s.status = :status")
    Integer sumActualMinutesByUserAndStatus(
            @Param("user") User user,
            @Param("status") SessionStatus status
    );

    @Query("SELECT COALESCE(SUM(s.actualMinutes), 0) " +
            "FROM ScheduleSession s " +
            "WHERE s.week.user = :user " +
            "AND s.status = :status " +
            "AND s.date >= :startDate")
    Integer sumActualMinutesByUserAndStatusAfterDate(
            @Param("user") User user,
            @Param("status") SessionStatus status,
            @Param("startDate") LocalDate startDate
    );

    @Query("SELECT s FROM ScheduleSession s " +
            "WHERE s.week.user = :user " +
            "AND s.status = 'DONE' " +
            "ORDER BY s.date DESC")
    List<ScheduleSession> findCompletedSessionsByUserOrderByDateDesc(@Param("user") User user);
}