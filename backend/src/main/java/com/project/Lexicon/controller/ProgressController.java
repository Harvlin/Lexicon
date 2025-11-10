package com.project.Lexicon.controller;

import com.project.Lexicon.domain.ProgressStatus;
import com.project.Lexicon.domain.entity.Lesson;
import com.project.Lexicon.domain.entity.Progress;
import com.project.Lexicon.domain.entity.User;
import com.project.Lexicon.repository.LessonRepository;
import com.project.Lexicon.repository.ProgressRepository;
import com.project.Lexicon.service.ProgressService;
import com.project.Lexicon.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@Slf4j
public class ProgressController {

    private final ProgressService progressService;
    private final UserService userService;
    private final ProgressRepository progressRepository;
    private final LessonRepository lessonRepository;

    @Autowired
    public ProgressController(ProgressService progressService, 
                            UserService userService,
                            ProgressRepository progressRepository,
                            LessonRepository lessonRepository) {
        this.progressService = progressService;
        this.userService = userService;
        this.progressRepository = progressRepository;
        this.lessonRepository = lessonRepository;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(Authentication authentication) {
        log.info("GET /api/progress/summary - User: {}", authentication.getName());

        User user = getAuthenticatedUser(authentication);
        Map<String, Object> summary = progressService.getUserProgressSummary(user);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/activity/weekly")
    public ResponseEntity<?> getWeeklyActivity(Authentication authentication) {
        log.info("GET /api/progress/activity/weekly - User: {}", authentication.getName());

        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(progressService.getWeeklyActivity(user));
    }

    @GetMapping("/time-stats")
    public ResponseEntity<Map<String, Object>> getTimeStats(Authentication authentication) {
        log.info("GET /api/progress/time-stats - User: {}", authentication.getName());

        User user = getAuthenticatedUser(authentication);
        Map<String, Object> stats = progressService.getTimeStats(user);

        return ResponseEntity.ok(stats);
    }

    /**
     * Migrate localStorage completion data to Progress table
     * Accepts array of {lessonId, completedAt, duration} objects
     */
    @PostMapping("/migrate-local")
    public ResponseEntity<?> migrateLocalStorageData(
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        
        log.info("POST /api/progress/migrate-local - User: {}", authentication.getName());

        try {
            User user = getAuthenticatedUser(authentication);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> completedVideos = (Map<String, Object>) payload.get("completedVideos");
            
            if (completedVideos == null || completedVideos.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "migrated", 0,
                    "message", "No data to migrate"
                ));
            }

            int migratedCount = 0;
            List<String> errors = new ArrayList<>();

            for (Map.Entry<String, Object> entry : completedVideos.entrySet()) {
                String lessonId = entry.getKey();
                
                try {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> completionData = (Map<String, Object>) entry.getValue();
                    
                    // Parse lesson ID (handle both "123" and "api-video-123" formats)
                    Long numericLessonId;
                    if (lessonId.startsWith("api-video-")) {
                        // Video completion - use negative ID
                        numericLessonId = -Long.parseLong(lessonId.replace("api-video-", ""));
                    } else {
                        // Regular lesson
                        numericLessonId = Long.parseLong(lessonId);
                    }

                    // Check if already exists
                    if (progressRepository.findByUserAndLesson_Id(user, numericLessonId).isPresent()) {
                        log.debug("Progress already exists for lesson {}, skipping", lessonId);
                        continue;
                    }

                    // Create Progress record
                    Lesson lesson = null;
                    if (numericLessonId > 0) {
                        lesson = lessonRepository.findById(numericLessonId).orElse(null);
                    }

                    Progress progress = Progress.builder()
                            .user(user)
                            .lesson(lesson)
                            .status(ProgressStatus.COMPLETED)
                            .completedAt(Instant.parse((String) completionData.get("completedAt")))
                            .progressPercent(100)
                            .build();

                    progressRepository.save(progress);
                    migratedCount++;
                    
                } catch (Exception e) {
                    log.warn("Failed to migrate lesson {}: {}", lessonId, e.getMessage());
                    errors.add(lessonId + ": " + e.getMessage());
                }
            }

            log.info("Successfully migrated {} completion records for user {}", migratedCount, user.getEmail());

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "migrated", migratedCount,
                    "errors", errors,
                    "message", "Migrated " + migratedCount + " completion records"
            ));

        } catch (Exception e) {
            log.error("Failed to migrate local storage data: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    // Helper method
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