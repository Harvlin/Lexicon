package com.project.Lexicon.service.impl;

import com.project.Lexicon.domain.entity.User;
import com.project.Lexicon.domain.entity.Video;
import com.project.Lexicon.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.*;

@Service
public class ProcessServiceImpl implements ProcessService {

    private static final Logger log = LoggerFactory.getLogger(ProcessServiceImpl.class);

    private static final int TARGET_SUCCESSFUL_VIDEOS = 5;
    private static final int MAX_VIDEOS_TO_ATTEMPT = 50;
    private static final long REQUEST_DELAY_MS = 2000;

    private final OllamaService ollamaService;
    private final YoutubeService youtubeService;
    private final TranscriptionService transcriptionService;
    private final StudyMaterialService studyMaterialService;
    private final ExecutorService executorService;
    private final Semaphore rateLimiter = new Semaphore(1);

    @Autowired
    public ProcessServiceImpl(OllamaService ollamaService,
                              YoutubeService youtubeService,
                              TranscriptionService transcriptionService,
                              StudyMaterialService studyMaterialService) {
        this.ollamaService = ollamaService;
        this.youtubeService = youtubeService;
        this.transcriptionService = transcriptionService;
        this.studyMaterialService = studyMaterialService;

        this.executorService = Executors.newFixedThreadPool(3, r -> {
            Thread t = new Thread(r);
            t.setDaemon(true);
            t.setName("ProcessService-" + t.threadId());
            return t;
        });
    }

    @Override
    public Map<String, Object> processOnly(String preference) {
        return executeProcessing(preference);
    }

    @Override
    @Transactional
    public Map<String, Object> processAndSave(String preference, User user) {
        log.info("🎯 processAndSave called - User: {}", user != null ? user.getId() : "null");

        // First, do the processing
        Map<String, Object> result = executeProcessing(preference);

        // If successful and user is authenticated, save immediately
        if ("success".equals(result.get("status")) && user != null) {
            try {
                log.info("💾 Starting database save for user ID: {}", user.getId());
                saveMaterialsToDatabase(result, user);
                result.put("savedToDatabase", true);
                log.info("✅ Study materials saved to database for user {}", user.getId());
            } catch (Exception e) {
                log.error("❌ Failed to save to database: {}", e.getMessage(), e);
                result.put("savedToDatabase", false);
                result.put("saveError", e.getMessage());
            }
        } else {
            result.put("savedToDatabase", false);
            if (user == null) {
                result.put("saveReason", "User not authenticated");
                log.warn("⚠️ Not saving - user is null");
            } else {
                result.put("saveReason", "Processing failed");
                log.warn("⚠️ Not saving - processing status: {}", result.get("status"));
            }
        }

        return result;
    }

    /**
     * Core processing logic - separated for reusability
     */
    private Map<String, Object> executeProcessing(String preferences) {
        long startTime = System.currentTimeMillis();

        try {
            log.info("════════════════════════════════════════════");
            log.info("⚡ Starting video processing");
            log.info("   Query: '{}'", preferences);
            log.info("   Target: {} videos", TARGET_SUCCESSFUL_VIDEOS);
            log.info("════════════════════════════════════════════");

            // STEP 1: Generate Topic
            log.info("📌 STEP 1: Topic Generation");
            long step1Start = System.currentTimeMillis();
            String topic = generateTopic(preferences);
            long step1Time = System.currentTimeMillis() - step1Start;
            log.info("✅ Topic: '{}' ({}ms)", topic, step1Time);

            // STEP 2: Search Videos
            log.info("📌 STEP 2: Video Search");
            long step2Start = System.currentTimeMillis();
            List<Video> videos = youtubeService.searchVideos(topic);
            long step2Time = System.currentTimeMillis() - step2Start;

            if (videos.isEmpty()) {
                return buildErrorResponse(preferences, topic,
                        "No videos found - YouTube API issue",
                        "Check your API key and quota",
                        System.currentTimeMillis() - startTime);
            }

            log.info("✅ Found {} candidate videos ({}ms)", videos.size(), step2Time);

            // STEP 3: Process Videos
            log.info("📌 STEP 3: Processing videos with transcripts and AI materials");
            long step3Start = System.currentTimeMillis();
            List<Map<String, Object>> processedVideos = processVideosUntilTarget(videos, topic);
            long step3Time = System.currentTimeMillis() - step3Start;

            if (processedVideos.isEmpty()) {
                return buildErrorResponse(preferences, topic,
                        "No videos with captions found",
                        "Try a more popular topic",
                        System.currentTimeMillis() - startTime);
            }

            log.info("✅ Processed {} videos in {}s", processedVideos.size(), step3Time / 1000);

            // STEP 4: Learning Plan
            log.info("📌 STEP 4: Generating Learning Plan");
            long step4Start = System.currentTimeMillis();
            String learningPlan = generateLearningPlan(processedVideos, topic);
            long step4Time = System.currentTimeMillis() - step4Start;
            log.info("✅ Learning plan generated ({}ms)", step4Time);

            // Build response
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("status", "success");
            result.put("userPreference", preferences);
            result.put("generatedTopic", topic);
            result.put("videos", processedVideos);
            result.put("learningPlan", learningPlan);

            long totalTime = System.currentTimeMillis() - startTime;
            result.put("processing", Map.of(
                    "totalTimeMs", totalTime,
                    "totalTimeFormatted", formatDuration(totalTime),
                    "step1_topicMs", step1Time,
                    "step2_searchMs", step2Time,
                    "step3_processMs", step3Time,
                    "step4_planMs", step4Time
            ));

            result.put("videoStats", Map.of(
                    "target", TARGET_SUCCESSFUL_VIDEOS,
                    "successful", processedVideos.size(),
                    "candidatesFound", videos.size()
            ));

            log.info("════════════════════════════════════════════");
            log.info("🎉 SUCCESS! {} videos in {}", processedVideos.size(), formatDuration(totalTime));
            log.info("════════════════════════════════════════════");

            return result;

        } catch (Exception e) {
            log.error("❌ Fatal Error: {}", e.getMessage(), e);
            return buildErrorResponse(preferences, null,
                    "Processing failed: " + e.getMessage(),
                    "Check logs for details",
                    System.currentTimeMillis() - startTime);
        }
    }

    /**
     * Save all materials to database immediately after processing
     */
    private void saveMaterialsToDatabase(Map<String, Object> result, User user) {
        String topic = (String) result.get("generatedTopic");
        String userPreference = (String) result.get("userPreference");
        List<Map<String, Object>> videos = (List<Map<String, Object>>) result.get("videos");
        String learningPlan = (String) result.get("learningPlan");

        List<Long> savedVideoIds = new ArrayList<>();

        // Save each video with its materials
        for (Map<String, Object> videoData : videos) {
            try {
                Video savedVideo = studyMaterialService.saveVideoWithMaterials(user, videoData, topic);
                savedVideoIds.add(savedVideo.getId());
                log.debug("✓ Saved video: {}", savedVideo.getTitle());
            } catch (Exception e) {
                log.error("Failed to save video '{}': {}",
                        videoData.get("title"), e.getMessage());
            }
        }

        // Save learning plan
        if (learningPlan != null && !learningPlan.isEmpty()
                && !learningPlan.equals("Review individual video summaries above.")) {
            try {
                studyMaterialService.saveLearningPlan(user, topic, learningPlan, userPreference);
                log.debug("✓ Saved learning plan");
            } catch (Exception e) {
                log.error("Failed to save learning plan: {}", e.getMessage());
            }
        }

        // Add saved IDs to response
        result.put("savedVideoIds", savedVideoIds);
        result.put("savedCount", savedVideoIds.size());
    }

    private String generateTopic(String preference) {
        try {
            String topic = executeWithTimeout(
                    () -> ollamaService.getTopic(preference),
                    300,
                    "Topic generation"
            );
            log.info("✅ AI-generated topic: '{}'", topic);
            return topic;
        } catch (Exception e) {
            log.warn("⚠️ AI topic generation failed ({}), using fallback", e.getMessage());
            return generateTopicFallback(preference);
        }
    }

    private String generateLearningPlan(List<Map<String, Object>> processedVideos, String topic) {
        if (processedVideos.size() < 2) {
            return "Review individual video summaries above.";
        }

        Map<String, String> summaries = new LinkedHashMap<>();
        for (Map<String, Object> video : processedVideos) {
            Map<String, Object> summaryInfo = (Map<String, Object>) video.get("summary");
            if (summaryInfo != null) {
                summaries.put((String) video.get("title"),
                        (String) summaryInfo.get("content"));
            }
        }

        try {
            return executeWithTimeout(
                    () -> ollamaService.generateLearningPlan(summaries, topic),
                    600,
                    "Learning plan"
            );
        } catch (Exception e) {
            log.warn("⚠️ Learning plan generation failed: {}", e.getMessage());
            return "Review individual video summaries above.";
        }
    }

    private List<Map<String, Object>> processVideosUntilTarget(List<Video> videos, String topic) {
        List<Map<String, Object>> successful = new ArrayList<>();
        int attempted = 0;

        for (int i = 0; i < videos.size() && successful.size() < TARGET_SUCCESSFUL_VIDEOS; i++) {
            if (attempted >= MAX_VIDEOS_TO_ATTEMPT) {
                log.warn("⚠️ Reached max attempts ({})", MAX_VIDEOS_TO_ATTEMPT);
                break;
            }

            Video currentVideo = videos.get(i);
            log.info("📹 [Attempt {}/{}] [Success {}/{}] '{}'",
                    attempted + 1, Math.min(videos.size(), MAX_VIDEOS_TO_ATTEMPT),
                    successful.size(), TARGET_SUCCESSFUL_VIDEOS,
                    truncate(currentVideo.getTitle(), 55));

            try {
                if (attempted > 0) {
                    Thread.sleep(REQUEST_DELAY_MS);
                }

                rateLimiter.acquire();
                try {
                    Map<String, Object> result = processSingleVideo(currentVideo, topic, successful.size() + 1);
                    attempted++;

                    if ("success".equals(result.get("status"))) {
                        successful.add(result);
                        long time = (long) result.get("processingTimeMs");
                        log.info("  ✅ SUCCESS #{} (took {}s)", successful.size(), time / 1000);
                    } else {
                        log.warn("  ❌ {}", truncate((String) result.get("error"), 50));
                    }
                } finally {
                    rateLimiter.release();
                }

            } catch (Exception e) {
                log.error("  ❌ Exception: {}", e.getMessage());
                attempted++;
            }
        }

        log.info("📊 FINAL: {} successful out of {} attempts", successful.size(), attempted);
        return successful;
    }

    private Map<String, Object> processSingleVideo(Video video, String topic, int successNumber) {
        Map<String, Object> videoData = new LinkedHashMap<>();
        long videoStart = System.currentTimeMillis();

        try {
            // Get transcript
            log.debug("  📝 Fetching transcript...");
            String transcript = executeWithTimeout(
                    () -> transcriptionService.transcribeFromYouTube(video.getUrl()),
                    240,
                    "Transcript"
            );

            if (transcript == null || transcript.trim().isEmpty()) {
                throw new RuntimeException("No captions available");
            }

            // Generate AI materials
            log.debug("  🤖 Generating AI materials...");
            Map<String, Object> materials = executeWithTimeout(
                    () -> ollamaService.generateCombinedMaterials(transcript, video.getTitle(), topic),
                    600,
                    "Materials"
            );

            // Build video data
            videoData.put("videoNumber", successNumber);
            videoData.put("title", video.getTitle());
            videoData.put("channel", video.getChannelTitle());
            videoData.put("url", video.getUrl());
            videoData.put("videoId", video.getVideoId());
            videoData.put("transcript", Map.of(
                    "fullLength", transcript.length(),
                    "preview", truncate(transcript, 300)
            ));
            videoData.put("summary", materials.get("summary"));
            videoData.put("studyMaterials", materials.get("studyMaterials"));
            videoData.put("status", "success");
            videoData.put("processingTimeMs", System.currentTimeMillis() - videoStart);

            return videoData;

        } catch (Exception e) {
            videoData.put("status", "failed");
            videoData.put("error", e.getMessage());
            videoData.put("title", video.getTitle());
            videoData.put("processingTimeMs", System.currentTimeMillis() - videoStart);
            return videoData;
        }
    }

    private <T> T executeWithTimeout(Callable<T> task, int timeoutSeconds, String taskName) throws Exception {
        log.debug("⏳ Starting {} ({}s timeout)...", taskName, timeoutSeconds);
        long start = System.currentTimeMillis();

        Future<T> future = executorService.submit(task);

        try {
            T result = future.get(timeoutSeconds, TimeUnit.SECONDS);
            long duration = System.currentTimeMillis() - start;
            log.debug("✅ {} completed in {}s", taskName, duration / 1000);
            return result;
        } catch (TimeoutException e) {
            future.cancel(true);
            throw new RuntimeException(taskName + " timeout after " + timeoutSeconds + "s");
        } catch (ExecutionException e) {
            Throwable cause = e.getCause();
            if (cause instanceof Exception) throw (Exception) cause;
            throw new RuntimeException(cause);
        }
    }

    private String generateTopicFallback(String preference) {
        String cleaned = preference.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .trim();

        String[] stopWords = {"i", "want", "to", "learn", "teach", "me", "help",
                "understand", "about", "the", "a", "an", "how", "please"};

        for (String stop : stopWords) {
            cleaned = cleaned.replaceAll("\\b" + stop + "\\b", " ");
        }

        cleaned = cleaned.replaceAll("\\s+", " ").trim();

        if (!cleaned.contains("tutorial") && !cleaned.contains("course")) {
            cleaned = cleaned + " tutorial";
        }

        if (cleaned.isEmpty() || cleaned.length() < 5) {
            cleaned = preference.toLowerCase().replaceAll("[^a-z0-9\\s]", "") + " tutorial";
        }

        return cleaned;
    }

    private Map<String, Object> buildErrorResponse(String preference, String topic,
                                                   String error, String suggestion, long time) {
        return Map.of(
                "status", "error",
                "userPreference", preference,
                "generatedTopic", topic != null ? topic : "N/A",
                "error", error,
                "suggestion", suggestion,
                "processingTimeMs", time,
                "processingTimeFormatted", formatDuration(time)
        );
    }

    private String truncate(String text, int maxLength) {
        if (text == null || text.length() <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    }

    private String formatDuration(long ms) {
        long seconds = ms / 1000;
        long minutes = seconds / 60;
        seconds = seconds % 60;
        return minutes > 0 ?
                String.format("%dm %ds", minutes, seconds) :
                String.format("%ds", seconds);
    }
}