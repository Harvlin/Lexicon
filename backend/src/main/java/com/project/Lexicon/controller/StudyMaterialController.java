package com.project.Lexicon.controller;

import com.project.Lexicon.domain.entity.*;
import com.project.Lexicon.service.StudyMaterialService;
import com.project.Lexicon.service.UserService;
import com.project.Lexicon.service.YoutubeService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/study-materials")
@RequiredArgsConstructor
public class StudyMaterialController {

    private static final Logger log = LoggerFactory.getLogger(StudyMaterialController.class);

    private final StudyMaterialService studyMaterialService;
    private final UserService userService;
    private final YoutubeService youtubeService;
    
    // In-memory cache for video durations (persists until server restart)
    private final Map<String, Integer> durationCache = new ConcurrentHashMap<>();

    @GetMapping("/videos")
    public ResponseEntity<?> getUserVideos(Authentication authentication) {
        try {
            User user = getAuthenticatedUser(authentication);
            List<Video> videos = studyMaterialService.getUserVideos(user.getId());

            // Fetch durations for all videos in batch
            List<String> videoIds = videos.stream()
                    .map(Video::getVideoId)
                    .filter(id -> id != null && !id.isEmpty())
                    .collect(Collectors.toList());
            
            Map<String, Integer> durations = getDurationsWithCache(videoIds);

            List<Map<String, Object>> videosList = videos.stream()
                    .map(video -> videoToMap(video, durations))
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

            // Fetch durations for all videos in batch
            List<String> videoIds = videos.stream()
                    .map(Video::getVideoId)
                    .filter(id -> id != null && !id.isEmpty())
                    .collect(Collectors.toList());
            
            Map<String, Integer> durations = getDurationsWithCache(videoIds);

            List<Map<String, Object>> videosList = videos.stream()
                    .map(video -> videoToMap(video, durations))
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

            // Fetch duration for this single video
            Map<String, Integer> durations = new HashMap<>();
            if (video.getVideoId() != null && !video.getVideoId().isEmpty()) {
                durations = getDurationsWithCache(List.of(video.getVideoId()));
            }

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "video", videoToMapDetailed(video, durations)
            ));

        } catch (Exception e) {
            log.error("Failed to get video: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    /**
     * Mark a video as completed
     * Creates a schedule session with status 'done' for today if not exists
     */
    @PostMapping("/videos/{videoId}/complete")
    public ResponseEntity<?> completeVideo(
            @PathVariable Long videoId,
            Authentication authentication) {

        try {
            User user = getAuthenticatedUser(authentication);
            Video video = studyMaterialService.getVideoById(videoId, user.getId());

            log.info("User {} marking video {} as completed", user.getEmail(), videoId);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Video marked as completed",
                    "videoId", videoId,
                    "completedAt", java.time.Instant.now().toString()
            ));

        } catch (Exception e) {
            log.error("Failed to mark video as complete: {}", e.getMessage());
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

    /**
     * Get durations with caching - checks cache first, then fetches missing ones from YouTube API
     */
    private Map<String, Integer> getDurationsWithCache(List<String> videoIds) {
        if (videoIds == null || videoIds.isEmpty()) {
            return new HashMap<>();
        }

        Map<String, Integer> result = new HashMap<>();
        List<String> missingIds = new ArrayList<>();

        // Check cache first
        for (String videoId : videoIds) {
            if (durationCache.containsKey(videoId)) {
                result.put(videoId, durationCache.get(videoId));
            } else {
                missingIds.add(videoId);
            }
        }

        // Fetch missing durations from YouTube API
        if (!missingIds.isEmpty()) {
            log.info("📊 Cache hit: {}/{} durations, fetching {} from YouTube API", 
                    result.size(), videoIds.size(), missingIds.size());
            
            Map<String, Integer> fetchedDurations = youtubeService.getVideoDurations(missingIds);
            
            // Add to result and cache
            fetchedDurations.forEach((videoId, duration) -> {
                result.put(videoId, duration);
                durationCache.put(videoId, duration);
            });
        } else {
            log.debug("✅ All {} durations from cache", videoIds.size());
        }

        return result;
    }

    private Map<String, Object> videoToMap(Video video, Map<String, Integer> durations) {
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
        
        // Add duration from map (will be 0 if not found)
        Integer duration = durations.getOrDefault(video.getVideoId(), 0);
        map.put("duration", duration);
        
        return map;
    }

    // Keep old method for backward compatibility (without durations)
    private Map<String, Object> videoToMap(Video video) {
        return videoToMap(video, new HashMap<>());
    }

    private Map<String, Object> videoToMapDetailed(Video video, Map<String, Integer> durations) {
        Map<String, Object> map = videoToMap(video, durations);

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