package com.project.Lexicon.service;

import com.project.Lexicon.domain.entity.User;
import java.util.Map;

public interface ScheduleService {
    Map<String, Object> getWeek(User user, String weekId);
    Map<String, Object> saveWeek(User user, String weekId, Map<String, Object> payload);
    Map<String, Object> addSession(User user, String weekId, Map<String, Object> payload);
    Map<String, Object> updateSession(User user, String weekId, String sessionId, Map<String, Object> patch);
    void deleteSession(User user, String weekId, String sessionId);
}