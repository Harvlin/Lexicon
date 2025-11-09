package com.project.Lexicon.repository;

import com.project.Lexicon.domain.SessionStatus;
import com.project.Lexicon.domain.entity.ScheduleSession;
import com.project.Lexicon.domain.entity.User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleSessionRepository {
    List<ScheduleSession> findByWeek_UserAndStatusOrderByDateDesc(User user, SessionStatus status);
}
