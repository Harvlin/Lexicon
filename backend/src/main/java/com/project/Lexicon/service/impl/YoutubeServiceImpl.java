package com.project.Lexicon.service.impl;

import com.project.Lexicon.domain.entity.Video;
import com.project.Lexicon.service.YoutubeService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class YoutubeServiceImpl implements YoutubeService {

    private static final Logger logger = LoggerFactory.getLogger(YoutubeServiceImpl.class);

    @Value("${youtube.api.key}")
    private String apiKey;

    @Value("${transcript.service.url:http://localhost:5000}")
    private String transcriptServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ExecutorService checkExecutor = Executors.newFixedThreadPool(2);
    private final Semaphore checkThrottle = new Semaphore(1);

    private static final Map<String, String[]> QUALITY_CHANNELS = Map.of(
            "python", new String[]{
                    "UCCezIgC97PvUuR4_gbFUs5g",  // Corey Schafer
                    "UC8butISFwT-Wl7EV0hUK0BQ",  // freeCodeCamp
                    "UC4JX40jDee_tINbkjycV4Sg",  // Tech With Tim
                    "UCeVMnSShP_Iviwkknt83cww",  // Code With Harry
                    "UCWv7vMbMWH4-V0ZXdmDpPBA"   // Programming with Mosh
            },
            "javascript", new String[]{
                    "UC8butISFwT-Wl7EV0hUK0BQ",
                    "UC29ju8bIPH5as8OGnQzwJyA",
                    "UCW5YeuERMmlnqo4oq8vwUpg",
                    "UCWv7vMbMWH4-V0ZXdmDpPBA"
            },
            "java", new String[]{
                    "UC8butISFwT-Wl7EV0hUK0BQ",  // freeCodeCamp
                    "UCWv7vMbMWH4-V0ZXdmDpPBA",  // Programming with Mosh
                    "UC59K-uG2A5ogwIrHw4bmlEg"   // Telusko
            },
            "web", new String[]{
                    "UC8butISFwT-Wl7EV0hUK0BQ",
                    "UC29ju8bIPH5as8OGnQzwJyA",
                    "UCW5YeuERMmlnqo4oq8vwUpg"
            }
    );

    @PostConstruct
    public void init() {
        logger.info("═══════════════════════════════════════════");
        logger.info("🎬 YouTube Service Initialized");
        if (apiKey == null || apiKey.isEmpty()) {
            logger.error("❌ API KEY IS MISSING! Set youtube.api.key in application.properties");
        } else {
            logger.info("   API Key: {}...{}",
                    apiKey.substring(0, Math.min(10, apiKey.length())),
                    apiKey.length() > 20 ? apiKey.substring(apiKey.length() - 4) : "");
        }
        logger.info("═══════════════════════════════════════════");
        testApiKey();
    }

    private void testApiKey() {
        try {
            logger.info("🔑 Testing YouTube API key...");
            String testUrl = UriComponentsBuilder
                    .fromHttpUrl("https://www.googleapis.com/youtube/v3/search")
                    .queryParam("part", "snippet")
                    .queryParam("q", "test")
                    .queryParam("maxResults", 1)
                    .queryParam("type", "video")
                    .queryParam("key", apiKey)
                    .toUriString();

            ResponseEntity<Map> response = restTemplate.getForEntity(testUrl, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> body = response.getBody();
                if (body != null && body.containsKey("items")) {
                    logger.info("✅ YouTube API key is VALID and working!");
                    return;
                }
            }

            logger.error("❌ YouTube API key test failed - Invalid response format");

        } catch (HttpClientErrorException e) {
            logger.error("═══════════════════════════════════════════");
            logger.error("❌ YOUTUBE API KEY ERROR!");
            logger.error("   Status: {}", e.getStatusCode());
            logger.error("   Message: {}", e.getResponseBodyAsString());

            if (e.getStatusCode() == HttpStatus.FORBIDDEN) {
                logger.error("   → API key is invalid or not enabled for YouTube Data API v3");
                logger.error("   → Go to: https://console.cloud.google.com/apis/credentials");
            } else if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                logger.error("   → Quota exceeded! Reset at midnight Pacific Time");
            }
            logger.error("═══════════════════════════════════════════");

        } catch (Exception e) {
            logger.error("❌ YouTube API test error: {}", e.getMessage());
        }
    }

    @Override
    public List<Video> searchVideos(String query) {
        logger.info("🔎 Searching for: '{}'", query);

        String cleanQuery = cleanSearchQuery(query);
        logger.info("📝 Cleaned query: '{}'", cleanQuery);

        // Extract the main topic/technology
        String mainTopic = extractMainTopic(cleanQuery);
        logger.info("🎯 Main topic: '{}'", mainTopic);

        Set<Video> allVideos = new LinkedHashSet<>();
        String topicCategory = detectTopic(mainTopic);
        logger.info("📚 Topic category: {}", topicCategory);

        // Strategy 1: Verified channels (topic-specific)
        if (QUALITY_CHANNELS.containsKey(topicCategory)) {
            logger.info("🎯 Strategy 1: Verified channels for {}", topicCategory);
            String[] channelIds = QUALITY_CHANNELS.get(topicCategory);
            for (String channelId : channelIds) {
                List<Video> channelVideos = searchInChannel(channelId, mainTopic + " tutorial", 10);
                allVideos.addAll(channelVideos);
                logger.info("  + {} videos from channel {}",
                        channelVideos.size(), channelId.substring(0, 8));
            }
        }

        // Strategy 2: Topic-specific search
        logger.info("🎯 Strategy 2: Topic-specific search");
        List<Video> topicVideos = searchGeneral(mainTopic + " tutorial", 25);
        allVideos.addAll(topicVideos);
        logger.info("  + {} videos from topic search", topicVideos.size());

        // Strategy 3: Full course search
        logger.info("🎯 Strategy 3: Full course search");
        List<Video> courses = searchGeneral(mainTopic + " full course", 20);
        allVideos.addAll(courses);
        logger.info("  + {} course videos", courses.size());

        // Strategy 4: Long-form content
        logger.info("🎯 Strategy 4: Long-form content");
        List<Video> longVideos = searchByDuration(mainTopic + " complete tutorial", "long", 20);
        allVideos.addAll(longVideos);
        logger.info("  + {} long-form videos", longVideos.size());

        // **NEW: Filter out irrelevant videos based on main topic**
        List<Video> filteredVideos = filterByRelevance(new ArrayList<>(allVideos), mainTopic);
        logger.info("📊 After relevance filter: {} videos (removed {})",
                filteredVideos.size(), allVideos.size() - filteredVideos.size());

        if (filteredVideos.isEmpty()) {
            logger.error("═══════════════════════════════════════════");
            logger.error("❌ NO RELEVANT VIDEOS FOUND!");
            logger.error("   Query: {}", query);
            logger.error("   Main topic: {}", mainTopic);
            logger.error("═══════════════════════════════════════════");
            return new ArrayList<>();
        }

        logger.info("Found {} relevant candidates. Checking transcripts OPTIMIZED...", filteredVideos.size());

        // OPTIMIZED: Increased batch size 5→8 and reduced delay 3000→2000ms for faster verification
        List<Video> verifiedVideos = checkTranscriptsInBatches(filteredVideos, 8, 2000);

        // Sort by relevance score
        verifiedVideos.sort((v1, v2) -> {
            int score1 = calculateScore(v1, mainTopic, topicCategory);
            int score2 = calculateScore(v2, mainTopic, topicCategory);
            return Integer.compare(score2, score1);
        });

        logger.info("✅ Total: {} videos with verified transcripts", verifiedVideos.size());

        if (verifiedVideos.isEmpty() && !filteredVideos.isEmpty()) {
            logger.error("❌ Found {} videos but NONE have transcripts!", filteredVideos.size());
        }

        return verifiedVideos;
    }

    /**
     * Extract the main technology/topic from the query
     */
    private String extractMainTopic(String query) {
        String lower = query.toLowerCase();

        // Remove common noise words
        String[] noiseWords = {"tutorial", "course", "guide", "learn", "learning",
                "complete", "full", "beginner", "advanced", "programming"};

        String cleaned = lower;
        for (String noise : noiseWords) {
            cleaned = cleaned.replaceAll("\\b" + noise + "\\b", "");
        }

        cleaned = cleaned.trim().replaceAll("\\s+", " ");

        // If we have something left, use it
        if (!cleaned.isEmpty() && cleaned.length() >= 3) {
            return cleaned;
        }

        // Otherwise return original query
        return query;
    }

    /**
     * Filter videos by relevance to the main topic
     */
    private List<Video> filterByRelevance(List<Video> videos, String mainTopic) {
        if (mainTopic == null || mainTopic.trim().isEmpty()) {
            return videos;
        }

        String[] topicWords = mainTopic.toLowerCase().split("\\s+");

        return videos.stream()
                .filter(video -> {
                    String titleLower = video.getTitle().toLowerCase();
                    String descLower = video.getDescription().toLowerCase();

                    // Check if at least one main topic word appears in title or description
                    for (String word : topicWords) {
                        if (word.length() >= 3) {  // Only check words with 3+ chars
                            if (titleLower.contains(word) || descLower.contains(word)) {
                                return true;
                            }
                        }
                    }

                    // Also check channel title for known quality channels
                    String channelLower = video.getChannelTitle().toLowerCase();
                    if (channelLower.contains("freecodecamp") ||
                            channelLower.contains("programming with mosh") ||
                            channelLower.contains("traversy media")) {
                        return true;
                    }

                    return false;
                })
                .collect(Collectors.toList());
    }

    private String cleanSearchQuery(String query) {
        // Remove weird prefixes
        query = query.replaceAll("(?i)^(the )?extracted search keywords?:?\\s*", "");
        query = query.replaceAll("(?i)^(output|result|keywords?)\\s*:?\\s*", "");

        // Remove extra spaces
        query = query.trim().replaceAll("\\s+", " ");

        // Limit length
        if (query.length() > 100) {
            String[] words = query.split("\\s+");
            if (words.length > 5) {
                query = String.join(" ", Arrays.copyOfRange(words, 0, 5));
            }
        }

        return query;
    }

    /**
     * OPTIMIZED: Check transcripts in parallel batches with adaptive delay
     */
    private List<Video> checkTranscriptsInBatches(
            List<Video> videos, int batchSize, long delayMs) {

        List<Video> verified = new ArrayList<>();
        int totalVideos = videos.size();

        // OPTIMIZATION: Use provided batch size (already optimized - 8 videos)
        int optimalBatchSize = Math.max(batchSize, 8);

        logger.info("🔄 OPTIMIZED: Checking {} videos: {} per batch, {}ms delay",
                totalVideos, optimalBatchSize, delayMs);

        for (int i = 0; i < totalVideos; i += optimalBatchSize) {
            int end = Math.min(i + optimalBatchSize, totalVideos);
            List<Video> batch = videos.subList(i, end);

            logger.debug("Checking batch {}-{} of {}", i + 1, end, totalVideos);

            List<CompletableFuture<Optional<Video>>> futures = batch.stream()
                    .map(video -> CompletableFuture.supplyAsync(
                            () -> checkTranscriptAvailabilityThrottled(video),
                            checkExecutor
                    ))
                    .collect(Collectors.toList());

            List<Video> batchVerified = futures.stream()
                    .map(CompletableFuture::join)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toList());

            verified.addAll(batchVerified);

            if (batchVerified.size() > 0) {
                logger.info("  ✅ Batch complete: {} verified (total: {})",
                        batchVerified.size(), verified.size());
            }

            // OPTIMIZATION: More aggressive adaptive delay for faster processing
            if (end < totalVideos && verified.size() < 10) {
                try {
                    // Reduced delay: if we have 5+ verified, delay is 1/3rd; if 8+, skip delay
                    long adaptiveDelay = verified.size() >= 8 ? 0 : 
                                        (verified.size() >= 5 ? delayMs / 3 : delayMs / 2);
                    if (adaptiveDelay > 0) {
                        Thread.sleep(adaptiveDelay);
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }

        logger.info("✅ Transcript check complete: {}/{} videos verified",
                verified.size(), totalVideos);
        return verified;
    }

    private Optional<Video> checkTranscriptAvailabilityThrottled(Video video) {
        try {
            checkThrottle.acquire();
            try {
                Thread.sleep(500);
                String checkUrl = transcriptServiceUrl + "/check/" + video.getVideoId();
                Map<String, Object> response = restTemplate.getForObject(checkUrl, Map.class);

                if (response != null && (Boolean) response.getOrDefault("has_transcripts", false)) {
                    logger.debug("✓ Has transcript: {}", video.getVideoId());
                    return Optional.of(video);
                }
                return Optional.empty();
            } finally {
                checkThrottle.release();
            }
        } catch (Exception e) {
            logger.debug("Failed to check {}: {}", video.getVideoId(), e.getMessage());
            return Optional.empty();
        }
    }

    private List<Video> searchInChannel(String channelId, String query, int maxResults) {
        try {
            String url = UriComponentsBuilder
                    .fromHttpUrl("https://www.googleapis.com/youtube/v3/search")
                    .queryParam("part", "snippet")
                    .queryParam("channelId", channelId)
                    .queryParam("maxResults", maxResults)
                    .queryParam("type", "video")
                    .queryParam("q", query)
                    .queryParam("order", "relevance")
                    .queryParam("key", apiKey)
                    .toUriString();

            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

            if (response.getStatusCode() != HttpStatus.OK) {
                return new ArrayList<>();
            }

            return parseResponse(response.getBody());

        } catch (Exception e) {
            logger.warn("Channel search failed: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    private List<Video> searchGeneral(String query, int maxResults) {
        try {
            String url = UriComponentsBuilder
                    .fromHttpUrl("https://www.googleapis.com/youtube/v3/search")
                    .queryParam("part", "snippet")
                    .queryParam("maxResults", maxResults)
                    .queryParam("type", "video")
                    .queryParam("q", query)
                    .queryParam("relevanceLanguage", "en")
                    .queryParam("order", "relevance")
                    .queryParam("key", apiKey)
                    .toUriString();

            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return parseResponse(response.getBody());

        } catch (Exception e) {
            logger.warn("General search failed: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    private List<Video> searchByDuration(String query, String duration, int maxResults) {
        try {
            String url = UriComponentsBuilder
                    .fromHttpUrl("https://www.googleapis.com/youtube/v3/search")
                    .queryParam("part", "snippet")
                    .queryParam("maxResults", maxResults)
                    .queryParam("type", "video")
                    .queryParam("q", query)
                    .queryParam("videoDuration", duration)
                    .queryParam("relevanceLanguage", "en")
                    .queryParam("order", "relevance")
                    .queryParam("key", apiKey)
                    .toUriString();

            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return parseResponse(response.getBody());

        } catch (Exception e) {
            logger.warn("Duration search failed: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    private String detectTopic(String query) {
        String lower = query.toLowerCase();
        if (lower.contains("python")) return "python";
        if (lower.contains("javascript") || lower.contains("js")) return "javascript";
        if (lower.contains("java") && !lower.contains("javascript")) return "java";
        if (lower.contains("web") || lower.contains("html") || lower.contains("css")) return "web";
        return "general";
    }

    private int calculateScore(Video video, String mainTopic, String topicCategory) {
        int score = 0;
        String titleLower = video.getTitle().toLowerCase();
        String channelLower = video.getChannelTitle().toLowerCase();
        String descLower = video.getDescription().toLowerCase();

        // Channel quality bonus
        if (channelLower.contains("freecodecamp")) score += 100;
        if (channelLower.contains("corey schafer")) score += 90;
        if (channelLower.contains("programming with mosh")) score += 90;
        if (channelLower.contains("traversy media")) score += 85;
        if (channelLower.contains("tech with tim")) score += 85;

        // Main topic match (most important!)
        String[] topicWords = mainTopic.toLowerCase().split("\\s+");
        for (String word : topicWords) {
            if (word.length() > 3) {
                if (titleLower.contains(word)) score += 50;  // Increased from 15
                if (descLower.contains(word)) score += 10;
            }
        }

        // Educational keywords
        if (titleLower.contains("tutorial")) score += 20;
        if (titleLower.contains("course")) score += 20;
        if (titleLower.contains("full course")) score += 30;
        if (titleLower.contains("complete")) score += 15;
        if (titleLower.contains("beginner")) score += 10;

        return score;
    }

    private List<Video> parseResponse(Map<String, Object> response) {
        List<Video> videos = new ArrayList<>();

        if (response == null || !response.containsKey("items")) {
            return videos;
        }

        List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");

        for (Map<String, Object> item : items) {
            try {
                Map<String, Object> id = (Map<String, Object>) item.get("id");
                Map<String, Object> snippet = (Map<String, Object>) item.get("snippet");

                if (id == null || snippet == null) continue;

                String videoId = (String) id.get("videoId");
                if (videoId == null) continue;

                String title = (String) snippet.get("title");
                String description = (String) snippet.getOrDefault("description", "");
                String channelTitle = (String) snippet.getOrDefault("channelTitle", "Unknown");

                if (title == null || title.isEmpty()) continue;

                Object liveBroadcast = snippet.get("liveBroadcastContent");
                if (liveBroadcast != null && !"none".equals(liveBroadcast)) {
                    continue;
                }

                Video video = Video.builder()
                        .videoId(videoId)
                        .title(title)
                        .description(description)
                        .channelTitle(channelTitle)
                        .url("https://www.youtube.com/watch?v=" + videoId)
                        .build();

                videos.add(video);

            } catch (Exception e) {
                logger.warn("Failed to parse video: {}", e.getMessage());
            }
        }

        return videos;
    }

    /**
     * Get video durations from YouTube API
     * Fetches duration for multiple videos in a single batch request (up to 50 videos)
     */
    @Override
    public Map<String, Integer> getVideoDurations(List<String> videoIds) {
        Map<String, Integer> durations = new HashMap<>();
        
        if (videoIds == null || videoIds.isEmpty()) {
            return durations;
        }

        try {
            // YouTube API supports up to 50 video IDs per request
            String idsParam = String.join(",", videoIds);
            
            String url = UriComponentsBuilder
                    .fromHttpUrl("https://www.googleapis.com/youtube/v3/videos")
                    .queryParam("part", "contentDetails")
                    .queryParam("id", idsParam)
                    .queryParam("key", apiKey)
                    .toUriString();

            logger.info("🕒 Fetching durations for {} videos from YouTube API", videoIds.size());
            
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                List<Map<String, Object>> items = (List<Map<String, Object>>) body.get("items");
                
                if (items != null) {
                    for (Map<String, Object> item : items) {
                        try {
                            String videoId = (String) item.get("id");
                            Map<String, Object> contentDetails = (Map<String, Object>) item.get("contentDetails");
                            
                            if (contentDetails != null && contentDetails.containsKey("duration")) {
                                String isoDuration = (String) contentDetails.get("duration");
                                int minutes = parseIsoDuration(isoDuration);
                                durations.put(videoId, minutes);
                                logger.debug("  Video {}: {} minutes", videoId, minutes);
                            }
                        } catch (Exception e) {
                            logger.warn("Failed to parse duration for video: {}", e.getMessage());
                        }
                    }
                }
                
                logger.info("✅ Successfully fetched {} durations", durations.size());
            }
        } catch (Exception e) {
            logger.error("❌ Failed to fetch video durations: {}", e.getMessage());
        }
        
        return durations;
    }

    /**
     * Parse ISO 8601 duration format (e.g., "PT1H30M45S") to minutes
     */
    private int parseIsoDuration(String isoDuration) {
        if (isoDuration == null || isoDuration.isEmpty()) {
            return 0;
        }
        
        try {
            // Remove PT prefix
            String duration = isoDuration.replace("PT", "");
            
            int hours = 0;
            int minutes = 0;
            int seconds = 0;
            
            // Extract hours (e.g., "1H30M45S" -> 1)
            if (duration.contains("H")) {
                int hIndex = duration.indexOf("H");
                hours = Integer.parseInt(duration.substring(0, hIndex));
                duration = duration.substring(hIndex + 1);
            }
            
            // Extract minutes (e.g., "30M45S" -> 30)
            if (duration.contains("M")) {
                int mIndex = duration.indexOf("M");
                minutes = Integer.parseInt(duration.substring(0, mIndex));
                duration = duration.substring(mIndex + 1);
            }
            
            // Extract seconds (e.g., "45S" -> 45)
            if (duration.contains("S")) {
                int sIndex = duration.indexOf("S");
                seconds = Integer.parseInt(duration.substring(0, sIndex));
            }
            
            // Convert to total minutes (round up if seconds > 30)
            int totalMinutes = hours * 60 + minutes;
            if (seconds > 30) {
                totalMinutes += 1;
            }
            
            return totalMinutes;
        } catch (Exception e) {
            logger.warn("Failed to parse ISO duration '{}': {}", isoDuration, e.getMessage());
            return 0;
        }
    }
}