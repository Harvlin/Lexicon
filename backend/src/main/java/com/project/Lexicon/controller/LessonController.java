package com.project.Lexicon.controller;

import com.project.Lexicon.domain.entity.Lesson;
import com.project.Lexicon.domain.entity.Progress;
import com.project.Lexicon.domain.entity.User;
import com.project.Lexicon.service.LessonService;
import com.project.Lexicon.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {

    private static final Logger log = LoggerFactory.getLogger(LessonController.class);

    private final LessonService lessonService;
    private final UserService userService;

    @GetMapping({"", "/list"})
    public ResponseEntity<?> getAllLessons(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) Boolean inProgress,
            @RequestParam(required = false, defaultValue = "50") Integer limit,
            Authentication authentication) {

        try {
            User user = getAuthenticatedUser(authentication);
            log.info("User {} fetching lessons (completed={}, inProgress={}, limit={})",
                    user.getEmail(), completed, inProgress, limit);

            List<Map<String, Object>> lessonsList;

            if (Boolean.TRUE.equals(completed)) {
                // Get completed lessons from Progress table
                lessonsList = lessonService.getCompletedLessons(user, limit)
                        .stream()
                        .map(this::lessonToMapWithProgress)
                        .collect(Collectors.toList());

            } else if (Boolean.TRUE.equals(inProgress)) {
                // Get in-progress lessons from Progress table
                lessonsList = lessonService.getInProgressLessons(user, limit)
                        .stream()
                        .map(this::lessonToMapWithProgress)
                        .collect(Collectors.toList());

            } else {
                // Get all lessons
                lessonsList = lessonService.getAllLessons()
                        .stream()
                        .limit(limit)
                        .map(this::lessonToMap)
                        .collect(Collectors.toList());
            }

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "count", lessonsList.size(),
                    "items", lessonsList
            ));

        } catch (Exception e) {
            log.error("Failed to get lessons: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLesson(
            @PathVariable Long id,
            Authentication authentication) {

        try {
            User user = getAuthenticatedUser(authentication);
            log.info("User {} fetching lesson {}", user.getEmail(), id);
            
            Lesson lesson = lessonService.getLesson(id);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "lesson", lessonToMap(lesson)
            ));

        } catch (Exception e) {
            log.error("Failed to get lesson {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String principal = authentication.getName();
        log.debug("Looking up user with principal: {}", principal);

        return userService.findByEmail(principal)
                .or(() -> userService.findByName(principal))
                .orElseThrow(() -> new RuntimeException("User not found: " + principal));
    }

    private Map<String, Object> lessonToMapWithProgress(Progress progress) {
        Map<String, Object> map = lessonToMap(progress.getLesson());
        map.put("progress", progress.getProgressPercent());
        map.put("completedAt", progress.getCompletedAt());
        return map;
    }

    private Map<String, Object> lessonToMap(Lesson lesson) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", String.valueOf(lesson.getId())); // Frontend expects string ID
        map.put("title", lesson.getTitle());
        map.put("description", lesson.getDescription());
        map.put("type", lesson.getType() != null ? lesson.getType().toString().toLowerCase() : "video");
        map.put("level", lesson.getLevel() != null ? lesson.getLevel().toString().toLowerCase() : "beginner");
        map.put("category", lesson.getCategory());
        map.put("duration", lesson.getDuration());
        map.put("thumbnail", lesson.getThumbnail());
        map.put("tags", lesson.getTags());
        
        // Frontend expects 'videoUrl' field
        String videoUrl = lesson.getVideoUrl();
        if (videoUrl == null || videoUrl.isEmpty()) {
            videoUrl = lesson.getContentUrl(); // Fallback to legacy contentUrl
        }
        map.put("videoUrl", videoUrl);
        map.put("contentUrl", lesson.getContentUrl()); // Keep for compatibility
        
        map.put("createdAt", lesson.getCreatedAt());
        map.put("updatedAt", lesson.getUpdatedAt());
        
        // Additional fields frontend might expect
        map.put("isFavorite", false); // TODO: Implement favorite check if needed
        map.put("progress", 0); // TODO: Implement progress tracking if needed
        
        return map;
    }
}
