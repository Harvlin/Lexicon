package com.project.Lexicon.service;

import com.project.Lexicon.domain.entity.User;
import java.util.List;
import java.util.Map;

public interface ProgressService {
    Map<String, Object> getUserProgressSummary(User user);

    List<Map<String, Object>> getWeeklyActivity(User user);

    Map<String, Object> getTimeStats(User user);
}