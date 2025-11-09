package com.project.Lexicon.controller;

import com.project.Lexicon.domain.entity.Lesson;
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

    /**
     * Get all lessons - required by frontend Schedule page
     */
    @GetMapping({"", "/list"})
    public ResponseEntity<?> getAllLessons(Authentication authentication) {
        try {
            User user = getAuthenticatedUser(authentication);
            log.info("User {} fetching all lessons", user.getEmail());
            
            List<Lesson> lessons = lessonService.getAllLessons();
            
            List<Map<String, Object>> lessonsList = lessons.stream()
                    .map(this::lessonToMap)
                    .collect(Collectors.toList());

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

    /**
     * Get a specific lesson by ID
     */
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

    // =============== HELPER METHODS ===============

    /**
     * Get authenticated user - handles both email and username from JWT
     */
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

    /**
     * Convert Lesson entity to Map for JSON response
     * Matches frontend LessonDTO interface
     */
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
