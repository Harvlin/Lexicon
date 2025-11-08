package com.project.Lexicon.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

@RestController
@RequestMapping("/api/diagnostic")
public class DiagnosticController {

    @Value("${youtube.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/youtube-test")
    public ResponseEntity<?> testYouTubeAPI() {
        try {
            String url = "https://www.googleapis.com/youtube/v3/search" +
                    "?part=snippet" +
                    "&type=video" +
                    "&maxResults=1" +
                    "&q=python" +
                    "&videoCaption=closedCaption" +
                    "&key=" + apiKey;

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null) {
                return ResponseEntity.ok(Map.of(
                        "status", "error",
                        "message", "YouTube API returned null"
                ));
            }

            if (response.containsKey("error")) {
                Map<String, Object> error = (Map<String, Object>) response.get("error");
                return ResponseEntity.ok(Map.of(
                        "status", "error",
                        "error", error,
                        "message", "YouTube API Error: " + error.get("message"),
                        "possibleCause", "API key might be invalid or quota exceeded"
                ));
            }

            if (response.containsKey("items")) {
                java.util.List<?> items = (java.util.List<?>) response.get("items");
                return ResponseEntity.ok(Map.of(
                        "status", "success",
                        "message", "YouTube API is working!",
                        "itemCount", items.size(),
                        "fullResponse", response
                ));
            }

            return ResponseEntity.ok(Map.of(
                    "status", "unknown",
                    "message", "Unexpected response format",
                    "response", response
            ));

        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "status", "error",
                    "message", e.getMessage(),
                    "type", e.getClass().getName(),
                    "possibleCause", "Network issue or invalid API key"
            ));
        }
    }

    @GetMapping("/transcript-test")
    public ResponseEntity<?> testTranscriptAPI() {
        try {
            // Test with a known working video
            String videoId = "kqtD5dpn9C8"; // Python tutorial

            String[] testUrls = {
                    "https://www.youtube.com/api/timedtext?v=" + videoId + "&lang=en",
                    "https://www.youtube.com/api/timedtext?v=" + videoId + "&lang=en&kind=asr",
                    "https://www.youtube.com/watch?v=" + videoId
            };

            java.util.List<Map<String, Object>> results = new java.util.ArrayList<>();

            for (String testUrl : testUrls) {
                try {
                    URL url = new URL(testUrl);
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("GET");
                    conn.setRequestProperty("User-Agent", "Mozilla/5.0");
                    conn.setConnectTimeout(10000);
                    conn.setReadTimeout(10000);

                    int responseCode = conn.getResponseCode();

                    BufferedReader in = new BufferedReader(new InputStreamReader(
                            responseCode == 200 ? conn.getInputStream() : conn.getErrorStream()
                    ));
                    StringBuilder content = new StringBuilder();
                    String line;
                    int maxLines = 5; // Only read first 5 lines for preview
                    int lineCount = 0;

                    while ((line = in.readLine()) != null && lineCount < maxLines) {
                        content.append(line);
                        lineCount++;
                    }
                    in.close();
                    conn.disconnect();

                    results.add(Map.of(
                            "url", testUrl,
                            "responseCode", responseCode,
                            "success", responseCode == 200,
                            "contentPreview", content.toString().substring(0, Math.min(200, content.length()))
                    ));

                } catch (Exception e) {
                    results.add(Map.of(
                            "url", testUrl,
                            "error", e.getMessage()
                    ));
                }
            }

            return ResponseEntity.ok(Map.of(
                    "status", "test_complete",
                    "videoId", videoId,
                    "results", results
            ));

        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/config-check")
    public ResponseEntity<?> checkConfiguration() {
        boolean hasKey = apiKey != null && !apiKey.isEmpty();
        String keyPreview = hasKey ? apiKey.substring(0, Math.min(10, apiKey.length())) + "..." : "NOT SET";

        return ResponseEntity.ok(Map.of(
                "ollamaConfigured", System.getenv("OLLAMA_HOST") != null || true,
                "youtubeKeyLength", apiKey != null ? apiKey.length() : 0,
                "youtubeKeyPresent", hasKey,
                "youtubeKeyPreview", keyPreview,
                "recommendation", hasKey ? "API key looks good" : "Set youtube.api.key in application.properties"
        ));
    }

    @GetMapping("/full-diagnostic")
    public ResponseEntity<?> fullDiagnostic() {
        Map<String, Object> config = (Map<String, Object>) checkConfiguration().getBody();
        Map<String, Object> youtube = (Map<String, Object>) testYouTubeAPI().getBody();
        Map<String, Object> transcript = (Map<String, Object>) testTranscriptAPI().getBody();

        return ResponseEntity.ok(Map.of(
                "timestamp", System.currentTimeMillis(),
                "configuration", config,
                "youtubeAPI", youtube,
                "transcriptAPI", transcript
        ));
    }
}