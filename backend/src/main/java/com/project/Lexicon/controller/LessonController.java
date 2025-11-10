package com.project.Lexicon.controller;

import com.project.Lexicon.domain.ProgressStatus;
import com.project.Lexicon.domain.entity.Lesson;
import com.project.Lexicon.domain.entity.Progress;
import com.project.Lexicon.domain.entity.User;
import com.project.Lexicon.domain.entity.UserFavorite;
import com.project.Lexicon.repository.ProgressRepository;
import com.project.Lexicon.repository.UserFavoriteRepository;
import com.project.Lexicon.service.LessonService;
import com.project.Lexicon.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {

    private static final Logger log = LoggerFactory.getLogger(LessonController.class);

    private final LessonService lessonService;
    private final UserService userService;
    private final ProgressRepository progressRepository;
    private final UserFavoriteRepository userFavoriteRepository;

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
                        .map(lesson -> lessonToMapWithUser(lesson, user))
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
                    "lesson", lessonToMapWithUser(lesson, user)
            ));

        } catch (Exception e) {
            log.error("Failed to get lesson {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    /**
     * Mark a lesson as completed
     * Creates or updates Progress record with COMPLETED status
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeLesson(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, Object> body,
            Authentication authentication) {

        try {
            User user = getAuthenticatedUser(authentication);
            Long lessonId = Long.parseLong(id);
            
            log.info("User {} marking lesson {} as completed", user.getEmail(), lessonId);
            
            Lesson lesson = lessonService.getLesson(lessonId);
            
            // Find or create Progress
            Progress progress = progressRepository.findByUserAndLesson_Id(user, lessonId)
                    .orElse(Progress.builder()
                            .user(user)
                            .lesson(lesson)
                            .progressPercent(0)
                            .build());
            
            progress.setStatus(ProgressStatus.COMPLETED);
            progress.setCompletedAt(Instant.now());
            progress.setProgressPercent(100);
            
            progressRepository.save(progress);
            
            log.info("Lesson {} marked as completed for user {}", lessonId, user.getEmail());
            
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "lessonId", lessonId,
                    "completedAt", progress.getCompletedAt().toString(),
                    "message", "Lesson marked as completed"
            ));

        } catch (NumberFormatException e) {
            log.error("Invalid lesson ID format: {}", id);
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", "Invalid lesson ID"));
        } catch (Exception e) {
            log.error("Failed to complete lesson {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    /**
     * Toggle favorite status for a lesson
     */
    @PostMapping("/{id}/favorite")
    public ResponseEntity<?> toggleFavorite(
            @PathVariable String id,
            Authentication authentication) {

        try {
            User user = getAuthenticatedUser(authentication);
            Long lessonId = Long.parseLong(id);
            
            log.info("User {} toggling favorite for lesson {}", user.getEmail(), lessonId);
            
            Lesson lesson = lessonService.getLesson(lessonId);
            
            // Check if already favorited
            Optional<UserFavorite> existing = userFavoriteRepository.findByUserAndLesson_Id(user, lessonId);
            
            boolean isFavorite;
            if (existing.isPresent()) {
                // Remove from favorites
                userFavoriteRepository.delete(existing.get());
                isFavorite = false;
                log.info("Removed lesson {} from favorites for user {}", lessonId, user.getEmail());
            } else {
                // Add to favorites
                UserFavorite favorite = UserFavorite.builder()
                        .user(user)
                        .lesson(lesson)
                        .build();
                userFavoriteRepository.save(favorite);
                isFavorite = true;
                log.info("Added lesson {} to favorites for user {}", lessonId, user.getEmail());
            }
            
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "lessonId", lessonId,
                    "isFavorite", isFavorite
            ));

        } catch (NumberFormatException e) {
            log.error("Invalid lesson ID format: {}", id);
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", "Invalid lesson ID"));
        } catch (Exception e) {
            log.error("Failed to toggle favorite for lesson {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    /**
     * Get all favorited lessons for the current user
     */
    @GetMapping("/favorited")
    public ResponseEntity<?> getFavoritedLessons(Authentication authentication) {
        try {
            User user = getAuthenticatedUser(authentication);
            log.info("User {} fetching favorited lessons", user.getEmail());
            
            List<UserFavorite> favorites = userFavoriteRepository.findAllByUserWithDetails(user);
            
            List<Map<String, Object>> favoritedLessons = favorites.stream()
                    .filter(f -> f.getLesson() != null)
                    .map(f -> {
                        Map<String, Object> map = lessonToMap(f.getLesson());
                        map.put("isFavorite", true);
                        map.put("favoritedAt", f.getFavoritedAt());
                        return map;
                    })
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "count", favoritedLessons.size(),
                    "items", favoritedLessons
            ));

        } catch (Exception e) {
            log.error("Failed to get favorited lessons: {}", e.getMessage(), e);
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
        // Note: This basic version doesn't check favorites
        // Use lessonToMapWithUser for favorite checking
        return lessonToMapWithUser(lesson, null);
    }
    
    private Map<String, Object> lessonToMapWithUser(Lesson lesson, User user) {
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
        
        // Check if favorited by user
        boolean isFavorite = false;
        if (user != null) {
            isFavorite = userFavoriteRepository.findByUserAndLesson_Id(user, lesson.getId()).isPresent();
        }
        map.put("isFavorite", isFavorite);
        
        // Check progress
        int progress = 0;
        if (user != null) {
            Optional<Progress> progressOpt = progressRepository.findByUserAndLesson_Id(user, lesson.getId());
            if (progressOpt.isPresent()) {
                progress = progressOpt.get().getProgressPercent() != null ? progressOpt.get().getProgressPercent() : 0;
            }
        }
        map.put("progress", progress);
        
        return map;
    }
}
