package com.project.Lexicon.controller;

import com.project.Lexicon.domain.entity.Progress;
import com.project.Lexicon.domain.entity.ScheduleSession;
import com.project.Lexicon.domain.entity.User;
import com.project.Lexicon.repository.ProgressRepository;
import com.project.Lexicon.repository.ScheduleWeekRepository;
import com.project.Lexicon.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final UserService userService;
    private final ProgressRepository progressRepository;
    private final ScheduleWeekRepository scheduleWeekRepository;

    /**
     * Get recent activity timeline combining completions and schedule sessions
     */
    @GetMapping("/recent-activity")
    public ResponseEntity<?> getRecentActivity(
            @RequestParam(defaultValue = "7") int days,
            @RequestParam(defaultValue = "20") int limit,
            Authentication authentication) {

        try {
            User user = getAuthenticatedUser(authentication);
            log.info("GET /api/dashboard/recent-activity - User: {}, days: {}, limit: {}", 
                     user.getEmail(), days, limit);

            Instant since = Instant.now().minus(days, ChronoUnit.DAYS);

            // Get recent completions from Progress table
            List<Progress> recentProgress = progressRepository.findAllByUserWithLessons(user).stream()
                    .filter(p -> p.getCompletedAt() != null && p.getCompletedAt().isAfter(since))
                    .sorted((a, b) -> b.getCompletedAt().compareTo(a.getCompletedAt()))
                    .collect(Collectors.toList());

            // Get recent schedule sessions
            List<ScheduleSession> recentSessions = scheduleWeekRepository.findByUser(user).stream()
                    .flatMap(week -> week.getSessions().stream())
                    .filter(s -> s.getUpdatedAt() != null && s.getUpdatedAt().isAfter(since))
                    .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                    .collect(Collectors.toList());

            // Combine into activity timeline
            List<Map<String, Object>> activities = new ArrayList<>();

            // Add completions
            for (Progress progress : recentProgress) {
                Map<String, Object> activity = new HashMap<>();
                activity.put("type", "completion");
                activity.put("timestamp", progress.getCompletedAt());
                activity.put("lessonId", progress.getLesson() != null ? progress.getLesson().getId() : null);
                activity.put("lessonTitle", progress.getLesson() != null ? progress.getLesson().getTitle() : "Video");
                activity.put("status", progress.getStatus().toString());
                activities.add(activity);
            }

            // Add schedule sessions
            for (ScheduleSession session : recentSessions) {
                Map<String, Object> activity = new HashMap<>();
                activity.put("type", "session");
                activity.put("timestamp", session.getUpdatedAt());
                activity.put("lessonId", session.getLesson() != null ? session.getLesson().getId() : null);
                activity.put("lessonTitle", session.getLesson() != null ? session.getLesson().getTitle() : "Unknown");
                activity.put("status", session.getStatus().toString());
                activity.put("plannedMinutes", session.getPlannedMinutes());
                activity.put("actualMinutes", session.getActualMinutes());
                activity.put("date", session.getDate());
                activities.add(activity);
            }

            // Sort by timestamp descending
            activities.sort((a, b) -> {
                Instant tsA = (Instant) a.get("timestamp");
                Instant tsB = (Instant) b.get("timestamp");
                return tsB.compareTo(tsA);
            });

            // Limit results
            List<Map<String, Object>> limitedActivities = activities.stream()
                    .limit(limit)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "count", limitedActivities.size(),
                    "activities", limitedActivities,
                    "since", since.toString()
            ));

        } catch (Exception e) {
            log.error("Failed to get recent activity: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String principal = authentication.getName();
        return userService.findByEmail(principal)
                .or(() -> userService.findByName(principal))
                .orElseThrow(() -> new RuntimeException("User not found: " + principal));
    }
}
