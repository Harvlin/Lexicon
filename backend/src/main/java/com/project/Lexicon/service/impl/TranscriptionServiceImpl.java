package com.project.Lexicon.service.impl;

import com.project.Lexicon.service.TranscriptionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TranscriptionServiceImpl implements TranscriptionService {

    private static final Logger log = LoggerFactory.getLogger(TranscriptionServiceImpl.class);

    @Value("${transcript.service.url:http://localhost:5000}")
    private String transcriptServiceUrl;

    private final RestTemplate restTemplate;

    private final AtomicBoolean serviceAvailable = new AtomicBoolean(true);
    private final AtomicLong lastHealthCheck = new AtomicLong(0);
    private static final long HEALTH_CHECK_INTERVAL = 30000;

    // OPTIMIZATION: Cache transcripts to avoid redundant API calls during request processing
    private final Map<String, String> transcriptCache = new ConcurrentHashMap<>();
    private static final int MAX_CACHE_SIZE = 50;

    private static final Pattern YOUTUBE_URL_PATTERN = Pattern.compile(
            "^(https?://)?(www\\.)?(youtube\\.com/watch\\?v=|youtu\\.be/)([a-zA-Z0-9_-]{11}).*$"
    );

    public TranscriptionServiceImpl(RestTemplateBuilder builder) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);   // 10s connect
        factory.setReadTimeout(180000);     // 3 MINUTES read - be very patient!
        this.restTemplate = builder.requestFactory(() -> factory).build();
    }

    @PostConstruct
    public void init() {
        log.info("🔍 Checking transcript service at: {}", transcriptServiceUrl);
        checkServiceHealth();

        if (!serviceAvailable.get()) {
            log.error("═══════════════════════════════════════════");
            log.error("⚠️  Transcript service NOT available!");
            log.error("   Start: python transcript_service.py");
            log.error("═══════════════════════════════════════════");
        } else {
            log.info("✅ Transcript service ready (OPTIMIZED with caching, 3min timeout)");
        }
    }

    private boolean checkServiceHealth() {
        long now = System.currentTimeMillis();

        if (now - lastHealthCheck.get() < HEALTH_CHECK_INTERVAL) {
            return serviceAvailable.get();
        }

        try {
            String healthUrl = transcriptServiceUrl + "/health";
            ResponseEntity<Map> response = restTemplate.getForEntity(healthUrl, Map.class);

            boolean healthy = response.getStatusCode().is2xxSuccessful();
            serviceAvailable.set(healthy);
            lastHealthCheck.set(now);
            return healthy;

        } catch (Exception e) {
            log.debug("Health check failed: {}", e.getMessage());
            serviceAvailable.set(false);
            lastHealthCheck.set(now);
            return false;
        }
    }

    @Override
    public String transcribeFromYouTube(String videoUrl) {
        if (!isValidYouTubeUrl(videoUrl)) {
            throw new IllegalArgumentException("Invalid YouTube URL");
        }

        String videoId = extractVideoId(videoUrl);
        
        // OPTIMIZATION: Check cache first
        if (transcriptCache.containsKey(videoId)) {
            String cached = transcriptCache.get(videoId);
            log.info("🎯 Cache HIT: {} ({} chars)", videoId, cached.length());
            return cached;
        }

        log.debug("📥 Transcript request: {} (patient mode)", videoId);

        if (!checkServiceHealth()) {
            throw new RuntimeException("Transcript service unavailable at " + transcriptServiceUrl);
        }

        return attemptTranscription(videoId);
    }

    private String attemptTranscription(String videoId) {
        String url = transcriptServiceUrl + "/transcript?video_id=" + videoId;

        try {
            log.debug("⏳ Fetching transcript (may take 1-2 minutes)...");
            long start = System.currentTimeMillis();

            ResponseEntity<Map> resp = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> body = resp.getBody();

            long duration = System.currentTimeMillis() - start;
            log.debug("✅ Transcript received in {}ms", duration);

            if (resp.getStatusCode().is2xxSuccessful() && body != null && body.containsKey("transcript")) {
                String t = (String) body.get("transcript");
                if (t != null && !t.isBlank()) {
                    // OPTIMIZATION: Cache the result
                    if (transcriptCache.size() >= MAX_CACHE_SIZE) {
                        // Simple LRU: remove first entry
                        String firstKey = transcriptCache.keySet().iterator().next();
                        transcriptCache.remove(firstKey);
                    }
                    transcriptCache.put(videoId, t);
                    
                    log.info("✅ Transcript: {} chars in {}s (cached)", t.length(), duration/1000);
                    return t;
                }
            }

            log.warn("❌ Empty transcript for {}", videoId);
            return null;

        } catch (Exception e) {
            log.warn("❌ Transcript failed for {}: {}", videoId, e.getMessage());
            return null;
        }
    }

    private String extractVideoId(String videoUrl) {
        Matcher matcher = YOUTUBE_URL_PATTERN.matcher(videoUrl);
        if (matcher.matches()) {
            return matcher.group(4);
        }
        throw new IllegalArgumentException("Cannot extract video ID from: " + videoUrl);
    }

    private boolean isValidYouTubeUrl(String url) {
        return url != null && !url.trim().isEmpty() &&
                YOUTUBE_URL_PATTERN.matcher(url).matches();
    }

    public boolean isServiceAvailable() {
        return checkServiceHealth();
    }
}