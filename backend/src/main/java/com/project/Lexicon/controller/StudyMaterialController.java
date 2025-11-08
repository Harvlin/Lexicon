package com.project.Lexicon.controller;

import com.project.Lexicon.domain.entity.*;
import com.project.Lexicon.service.StudyMaterialService;
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
@RequestMapping("/api/study-materials")
@RequiredArgsConstructor
public class StudyMaterialController {

    private static final Logger log = LoggerFactory.getLogger(StudyMaterialController.class);

    private final StudyMaterialService studyMaterialService;
    private final UserService userService;

    @GetMapping("/videos")
    public ResponseEntity<?> getUserVideos(Authentication authentication) {
        try {
            User user = getAuthenticatedUser(authentication);
            List<Video> videos = studyMaterialService.getUserVideos(user.getId());

            List<Map<String, Object>> videosList = videos.stream()
                    .map(this::videoToMap)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "count", videosList.size(),
                    "videos", videosList
            ));

        } catch (Exception e) {
            log.error("Failed to get videos: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    /**
     * Get videos by topic
     */
    @GetMapping("/videos/topic/{topic}")
    public ResponseEntity<?> getUserVideosByTopic(
            @PathVariable String topic,
            Authentication authentication) {

        try {
            User user = getAuthenticatedUser(authentication);
            List<Video> videos = studyMaterialService.getUserVideosByTopic(user.getId(), topic);

            List<Map<String, Object>> videosList = videos.stream()
                    .map(this::videoToMap)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "topic", topic,
                    "count", videosList.size(),
                    "videos", videosList
            ));

        } catch (Exception e) {
            log.error("Failed to get videos by topic: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    /**
     * Get a specific video with all its materials
     */
    @GetMapping("/videos/{videoId}")
    public ResponseEntity<?> getVideo(
            @PathVariable Long videoId,
            Authentication authentication) {

        try {
            User user = getAuthenticatedUser(authentication);
            Video video = studyMaterialService.getVideoById(videoId, user.getId());

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "video", videoToMapDetailed(video)
            ));

        } catch (Exception e) {
            log.error("Failed to get video: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    /**
     * Get all learning plans for the user
     */
    @GetMapping("/learning-plans")
    public ResponseEntity<?> getLearningPlans(Authentication authentication) {
        try {
            User user = getAuthenticatedUser(authentication);
            List<LearningPlan> plans = studyMaterialService.getUserLearningPlans(user.getId());

            List<Map<String, Object>> plansList = plans.stream()
                    .map(this::learningPlanToMap)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "count", plansList.size(),
                    "plans", plansList
            ));

        } catch (Exception e) {
            log.error("Failed to get learning plans: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    /**
     * Get quiz questions for a video
     */
    @GetMapping("/videos/{videoId}/questions")
    public ResponseEntity<?> getQuizQuestions(
            @PathVariable Long videoId,
            Authentication authentication) {

        try {
            User user = getAuthenticatedUser(authentication);
            List<QuizQuestion> questions = studyMaterialService.getQuizQuestions(videoId, user.getId());

            List<Map<String, Object>> questionsList = questions.stream()
                    .map(this::questionToMap)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "videoId", videoId,
                    "count", questionsList.size(),
                    "questions", questionsList
            ));

        } catch (Exception e) {
            log.error("Failed to get questions: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    /**
     * Get flashcards for a video
     */
    @GetMapping("/videos/{videoId}/flashcards")
    public ResponseEntity<?> getFlashcards(
            @PathVariable Long videoId,
            Authentication authentication) {

        try {
            User user = getAuthenticatedUser(authentication);
            List<Flashcard> flashcards = studyMaterialService.getFlashcards(videoId, user.getId());

            List<Map<String, Object>> flashcardsList = flashcards.stream()
                    .map(this::flashcardToMap)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "videoId", videoId,
                    "count", flashcardsList.size(),
                    "flashcards", flashcardsList
            ));

        } catch (Exception e) {
            log.error("Failed to get flashcards: {}", e.getMessage());
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

        String principal = authentication.getName(); // Usually email from JWT
        log.debug("Looking up user with principal: {}", principal);

        // Try email first (most common in JWT), then fallback to username
        return userService.findByEmail(principal)
                .or(() -> userService.findByName(principal))
                .orElseThrow(() -> new RuntimeException("User not found: " + principal));
    }

    private Map<String, Object> videoToMap(Video video) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", video.getId());
        map.put("videoId", video.getVideoId());
        map.put("title", video.getTitle());
        map.put("channelTitle", video.getChannelTitle());
        map.put("videoUrl", video.getUrl());
        map.put("topic", video.getTopic());
        map.put("createdAt", video.getCreatedAt());
        map.put("hasQuestions", video.getQuestions() != null && !video.getQuestions().isEmpty());
        map.put("hasFlashcards", video.getFlashcards() != null && !video.getFlashcards().isEmpty());
        map.put("hasSummary", video.getSummary() != null);
        return map;
    }

    private Map<String, Object> videoToMapDetailed(Video video) {
        Map<String, Object> map = videoToMap(video);

        // Add summary
        if (video.getSummary() != null) {
            map.put("summary", Map.of(
                    "content", video.getSummary().getContent(),
                    "length", video.getSummary().getLength()
            ));
        }

        // Add questions
        if (video.getQuestions() != null) {
            map.put("questions", video.getQuestions().stream()
                    .map(this::questionToMap)
                    .collect(Collectors.toList()));
        }

        // Add flashcards
        if (video.getFlashcards() != null) {
            map.put("flashcards", video.getFlashcards().stream()
                    .map(this::flashcardToMap)
                    .collect(Collectors.toList()));
        }

        return map;
    }

    private Map<String, Object> questionToMap(QuizQuestion q) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", q.getId());
        map.put("questionNumber", q.getQuestionNumber());
        map.put("question", q.getQuestion());
        map.put("answer", q.getAnswer());
        return map;
    }

    private Map<String, Object> flashcardToMap(Flashcard f) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", f.getId());
        map.put("cardNumber", f.getCardNumber());
        map.put("front", f.getFront());
        map.put("back", f.getBack());
        return map;
    }

    private Map<String, Object> learningPlanToMap(LearningPlan plan) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", plan.getId());
        map.put("topic", plan.getTopic());
        map.put("userPreference", plan.getUserPreference());
        map.put("planContent", plan.getPlanContent());
        map.put("createdAt", plan.getCreatedAt());
        return map;
    }
}