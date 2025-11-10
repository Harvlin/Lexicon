package com.project.Lexicon.service.impl;

import com.project.Lexicon.service.OllamaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OllamaServiceImpl implements OllamaService {

    private static final Logger logger = LoggerFactory.getLogger(OllamaServiceImpl.class);

    @Value("${ollama.api.base-url}")
    private String ollamaUrl;

    private final RestTemplate restTemplate;
    
    // OPTIMIZATION: Topic cache to avoid redundant AI calls
    private final Map<String, String> topicCache = new ConcurrentHashMap<>();
    private static final int MAX_CACHE_SIZE = 100;

    public OllamaServiceImpl(RestTemplateBuilder builder) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(15000);
        factory.setReadTimeout(600000);

        this.restTemplate = builder
                .requestFactory(() -> factory)
                .build();
    }

    @PostConstruct
    public void init() {
        logger.info("🤖 Ollama Service initialized (OPTIMIZED MODE)");
        logger.info("   URL: {}", ollamaUrl);
        logger.info("   Timeouts: connect=15s, read=10min");
        logger.info("   Topic cache: enabled (max {} entries)", MAX_CACHE_SIZE);
    }

    @Override
    public String getTopic(String preference) {
        // OPTIMIZATION: Check cache first
        String cacheKey = preference.toLowerCase().trim();
        if (topicCache.containsKey(cacheKey)) {
            String cached = topicCache.get(cacheKey);
            logger.info("🎯 Cache HIT for: '{}' → '{}'", preference, cached);
            return cached;
        }

        logger.info("🔍 Generating topic from: '{}'", preference);

        // STREAMLINED prompt for faster topic generation
        String prompt = "Extract the MAIN TECHNOLOGY/SUBJECT from: \"" + preference + "\"\n\n" +
                "Rules:\n" +
                "- Output: main technology + 'tutorial' (max 4 words)\n" +
                "- Be SPECIFIC (Java → 'java tutorial', not 'programming')\n" +
                "- NO explanations\n\n" +
                "Examples:\n" +
                "\"learn java\" → java tutorial\n" +
                "\"python programming\" → python tutorial\n" +
                "\"web development\" → web development tutorial\n\n" +
                "Extract from: \"" + preference + "\"\n" +
                "Output:";

        String response = callOllamaWithRetry(prompt, 30, 2);

        // Clean the response AGGRESSIVELY
        String topic = cleanTopicResponse(response, preference);

        // OPTIMIZATION: Cache the result
        if (topicCache.size() >= MAX_CACHE_SIZE) {
            // Simple LRU: remove first entry
            String firstKey = topicCache.keySet().iterator().next();
            topicCache.remove(firstKey);
        }
        topicCache.put(cacheKey, topic);

        logger.info("✅ Final topic: '{}' (cached)", topic);
        return topic;
    }

    /**
     * Aggressively clean Ollama's response to get just keywords
     */
    private String cleanTopicResponse(String response, String originalPreference) {
        // Remove common prefixes Ollama adds
        response = response.replaceAll("(?i)^(output|keywords?|result|search query?|youtube search|extracted?|main|technology|subject)\\s*:?\\s*", "");
        response = response.replaceAll("(?i)^(here (is|are)|the)\\s+", "");

        // Remove quotes and other punctuation
        response = response.replaceAll("[\"'`*\\[\\]{}().,;:!?→\\-]", "");

        // Remove newlines and extra spaces
        response = response.replaceAll("\\n", " ");
        response = response.replaceAll("\\s+", " ");

        // Convert to lowercase
        response = response.toLowerCase().trim();

        // If response is empty or too short, use fallback
        if (response.isEmpty() || response.length() < 3) {
            logger.warn("Empty AI response, using fallback");
            return extractKeywordsFallback(originalPreference);
        }

        // Limit to 4 words max
        String[] words = response.split("\\s+");
        if (words.length > 4) {
            response = String.join(" ", Arrays.copyOfRange(words, 0, 4));
        }

        // Ensure "tutorial" is present for educational queries
        if (!response.contains("tutorial") && !response.contains("course") && !response.contains("guide")) {
            response = response + " tutorial";
        }

        return response.trim();
    }

    @Override
    public Map<String, Object> generateCombinedMaterials(String transcript, String title, String topic) {
        logger.info("🤖 Generating materials for: {}", truncate(title, 50));

        // QUALITY SAFEGUARD: Ensure we use enough content for quality generation
        // For short transcripts (<8000 chars), use full content
        // For long transcripts, use smart sampling: beginning (6000) + end (2000)
        String truncated;
        if (transcript.length() <= 8000) {
            truncated = transcript; // Use full content for short transcripts
            logger.debug("Using full transcript ({} chars)", transcript.length());
        } else {
            // OPTIMIZED: Use beginning + end for better context while reducing size
            truncated = transcript.substring(0, 6000) + 
                       "\n\n...[middle content omitted for processing efficiency]...\n\n" +
                       transcript.substring(Math.max(0, transcript.length() - 2000));
            logger.debug("Optimized transcript: {} → {} chars", transcript.length(), truncated.length());
        }

        // QUALITY-OPTIMIZED PROMPT - Streamlined but comprehensive
        String prompt = "Analyze this educational video transcript.\n\n" +
                "VIDEO: " + title + "\n" +
                "TOPIC: " + topic + "\n\n" +
                "TRANSCRIPT:\n" + truncated + "\n\n" +
                "Extract:\n\n" +
                "## SUMMARY\n" +
                "2-3 paragraph summary with:\n" +
                "- Main concepts/technologies (specific names)\n" +
                "- Practical demonstrations\n" +
                "- Key takeaways\n\n" +
                "## QUESTIONS\n" +
                "5 Q&A pairs from transcript content:\n" +
                "Q1: [specific concept]\nA1: [detailed answer]\n" +
                "(Q2-Q5: different concepts each)\n\n" +
                "## FLASHCARDS\n" +
                "5 flashcard pairs:\n" +
                "1. Front: [term]\n   Back: [definition]\n" +
                "(2-5: different concepts)\n\n" +
                "Use ONLY transcript content, not general knowledge.";

        long start = System.currentTimeMillis();
        String response = callOllamaWithRetry(prompt, 1300, 3);
        long duration = System.currentTimeMillis() - start;

        logger.info("✅ AI generation complete in {}s", duration/1000);

        Map<String, Object> result = new LinkedHashMap<>();

        try {
            String summaryContent = extractSection(response, "SUMMARY", "QUESTIONS");
            String questionsContent = extractSection(response, "QUESTIONS", "FLASHCARDS");
            String flashcardsContent = extractSection(response, "FLASHCARDS", null);

            // Fallback parsing if sections not found
            if (summaryContent.isEmpty() || questionsContent.isEmpty() || flashcardsContent.isEmpty()) {
                logger.warn("⚠️ Section markers not found, attempting fallback parsing");
                String[] parts = response.split("##\\s*");

                for (String part : parts) {
                    String partLower = part.toLowerCase();
                    if (partLower.startsWith("summary") && summaryContent.isEmpty()) {
                        summaryContent = part.substring(part.indexOf('\n') + 1).trim();
                    } else if (partLower.startsWith("question") && questionsContent.isEmpty()) {
                        questionsContent = part.substring(part.indexOf('\n') + 1).trim();
                    } else if (partLower.startsWith("flashcard") && flashcardsContent.isEmpty()) {
                        flashcardsContent = part.substring(part.indexOf('\n') + 1).trim();
                    }
                }
            }

            // QUALITY VALIDATION: Ensure content meets minimum standards
            if (summaryContent.isEmpty()) {
                summaryContent = response.substring(0, Math.min(response.length(), 1000));
                logger.warn("⚠️ Using fallback summary extraction");
            }

            // QUALITY CHECK: Validate summary length (should be substantial)
            if (summaryContent.length() < 100) {
                logger.warn("⚠️ Summary too short ({} chars), may indicate quality issue", 
                           summaryContent.length());
            } else {
                logger.debug("✅ Quality check passed: Summary {} chars, Questions {}, Flashcards {}",
                           summaryContent.length(), 
                           !questionsContent.isEmpty() ? "present" : "missing",
                           !flashcardsContent.isEmpty() ? "present" : "missing");
            }

            result.put("summary", Map.of(
                    "content", summaryContent,
                    "length", summaryContent.length()
            ));

            result.put("studyMaterials", Map.of(
                    "questions", questionsContent.isEmpty() ?
                            "Questions could not be extracted - see summary" : questionsContent,
                    "flashcards", flashcardsContent.isEmpty() ?
                            "Flashcards could not be extracted - see summary" : flashcardsContent
            ));

        } catch (Exception e) {
            logger.error("Failed to parse AI response: {}", e.getMessage());
            result.put("summary", Map.of("content", response, "length", response.length()));
            result.put("studyMaterials", Map.of(
                    "questions", "See summary for details",
                    "flashcards", "See summary for details"
            ));
        }

        return result;
    }

    @Override
    public String summarizeTranscript(String transcript, String topic) {
        Map<String, Object> combined = generateCombinedMaterials(transcript, "Video", topic);
        Map<String, Object> summary = (Map<String, Object>) combined.get("summary");
        return (String) summary.get("content");
    }

    @Override
    public Map<String, Object> generateStudyMaterials(String transcript, String summary,
                                                      String title, String topic) {
        Map<String, Object> combined = generateCombinedMaterials(transcript, title, topic);
        return (Map<String, Object>) combined.get("studyMaterials");
    }

    @Override
    public String generateLearningPlan(Map<String, String> summaries, String topic) {
        if (summaries == null || summaries.isEmpty()) {
            return "Unable to generate learning plan - no video summaries available.";
        }

        logger.info("🤖 Generating learning plan...");

        StringBuilder prompt = new StringBuilder();
        prompt.append("Create a learning plan for: ").append(topic).append("\n\n");
        prompt.append("Based on ").append(summaries.size()).append(" videos:\n\n");

        int num = 1;
        for (Map.Entry<String, String> entry : summaries.entrySet()) {
            prompt.append(num++).append(". ").append(entry.getKey()).append("\n");
            prompt.append(truncate(entry.getValue(), 250)).append("\n\n");
        }

        prompt.append("\nCreate:\n\n");
        prompt.append("## LEARNING PATH\nOptimal viewing order (1-").append(summaries.size()).append(") with reasoning.\n\n");
        prompt.append("## KEY CONCEPTS\n5-7 main concepts across all videos.\n\n");
        prompt.append("## LEARNING OUTCOMES\n4-6 skills gained.\n\n");
        prompt.append("## PRACTICE EXERCISES\n3 hands-on projects.");

        String plan = callOllamaWithRetry(prompt.toString(), 1500, 3);
        logger.info("✅ Learning plan generated: {} chars", plan.length());
        return plan;
    }

    private String callOllamaWithRetry(String prompt, int maxTokens, int maxRetries) {
        Exception lastError = null;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                logger.debug("🔄 Ollama attempt {}/{}", attempt, maxRetries);
                return callOllama(prompt, maxTokens);
            } catch (Exception e) {
                lastError = e;
                logger.warn("⚠️ Ollama attempt {} failed: {}", attempt, e.getMessage());

                if (attempt < maxRetries) {
                    try {
                        long waitMs = 2000 * attempt;
                        logger.debug("⏸️ Waiting {}s before retry...", waitMs/1000);
                        Thread.sleep(waitMs);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            }
        }

        throw new RuntimeException("AI service failed after " + maxRetries + " attempts: " +
                (lastError != null ? lastError.getMessage() : "unknown"));
    }

    private String callOllama(String prompt, int maxTokens) {
        try {
            // OPTIMIZATION: Adaptive thread count based on CPU cores
            int optimalThreads = Math.min(Runtime.getRuntime().availableProcessors(), 8);
            
            Map<String, Object> body = Map.of(
                    "model", "llama3",
                    "stream", false,
                    "messages", List.of(
                            Map.of("role", "system",
                                    "content", "You are a technical education content analyzer. " +
                                            "Extract specific, factual information from transcripts. " +
                                            "Be precise, detailed, and comprehensive. Focus on actual content."),
                            Map.of("role", "user", "content", prompt)
                    ),
                    "options", Map.of(
                            "temperature", 0.3,  // Lower temperature for more focused responses
                            "top_p", 0.9,
                            "num_predict", maxTokens,
                            "num_ctx", 8192,
                            "num_thread", optimalThreads,  // OPTIMIZED: Use available CPU threads
                            "num_batch", 512,  // OPTIMIZED: Larger batch for faster processing
                            "repeat_penalty", 1.1  // QUALITY: Avoid repetitive content
                    )
            );

            Map<String, Object> response = restTemplate.postForObject(ollamaUrl, body, Map.class);

            if (response != null && response.containsKey("message")) {
                Map<String, Object> message = (Map<String, Object>) response.get("message");
                return ((String) message.get("content")).trim();
            }

            throw new RuntimeException("Invalid Ollama response format");

        } catch (Exception e) {
            logger.error("❌ Ollama error: {}", e.getMessage());
            throw new RuntimeException("AI service failed: " + e.getMessage());
        }
    }

    private String extractKeywordsFallback(String preference) {
        String[] stopWords = {"i", "want", "to", "learn", "teach", "me", "help",
                "understand", "about", "the", "a", "an", "how", "please", "can",
                "you", "should", "could", "would", "need"};
        List<String> stopList = Arrays.asList(stopWords);

        String cleaned = preference.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "");

        String[] words = cleaned.split("\\s+");
        StringBuilder result = new StringBuilder();
        int count = 0;

        for (String word : words) {
            if (word.length() > 2 && count < 3 && !stopList.contains(word)) {
                if (result.length() > 0) result.append(" ");
                result.append(word);
                count++;
            }
        }

        String fallback = result.toString().trim();

        if (!fallback.isEmpty() && !fallback.contains("tutorial")) {
            fallback = fallback + " tutorial";
        }

        if (fallback.isEmpty()) {
            fallback = "programming tutorial";
        }

        return fallback;
    }

    private String extractSection(String text, String startMarker, String endMarker) {
        try {
            // Try with ## prefix
            int start = text.indexOf("## " + startMarker);
            if (start == -1) {
                // Try without ##
                start = text.indexOf(startMarker);
            }
            if (start == -1) {
                return "";
            }

            // Move to the content after the marker
            start = text.indexOf("\n", start);
            if (start == -1) {
                return "";
            }
            start++; // Move past the newline

            int end;
            if (endMarker != null) {
                end = text.indexOf("## " + endMarker, start);
                if (end == -1) {
                    end = text.indexOf(endMarker, start);
                }
                if (end == -1) {
                    end = text.length();
                }
            } else {
                end = text.length();
            }

            String content = text.substring(start, end).trim();

            // Remove any remaining section markers that might have been included
            content = content.replaceAll("(?m)^##\\s+\\w+\\s*$", "").trim();

            return content;
        } catch (Exception e) {
            logger.warn("Failed to extract section {}: {}", startMarker, e.getMessage());
            return "";
        }
    }

    private String truncate(String text, int max) {
        if (text == null || text.length() <= max) return text;
        return text.substring(0, max) + "...";
    }
}