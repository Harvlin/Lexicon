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

@Service
public class OllamaServiceImpl implements OllamaService {

    private static final Logger logger = LoggerFactory.getLogger(OllamaServiceImpl.class);

    @Value("${ollama.api.base-url}")
    private String ollamaUrl;

    private final RestTemplate restTemplate;

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
        logger.info("🤖 Ollama Service initialized (ULTRA-PATIENT MODE)");
        logger.info("   URL: {}", ollamaUrl);
        logger.info("   Timeouts: connect=15s, read=10min");
    }

    @Override
    public String getTopic(String preference) {
        logger.info("🔍 Generating topic from: '{}'", preference);

        // IMPROVED prompt focusing on specific technology/topic
        String prompt = "Extract the MAIN TECHNOLOGY or SUBJECT from this learning request.\n\n" +
                "User request: \"" + preference + "\"\n\n" +
                "Rules:\n" +
                "- Output ONLY the main technology/subject name + 'tutorial'\n" +
                "- Be SPECIFIC: if user says Java, output 'java tutorial' NOT 'programming tutorial'\n" +
                "- If user says Python, output 'python tutorial' NOT 'programming tutorial'\n" +
                "- Maximum 4 words\n" +
                "- NO explanations, NO extra words\n\n" +
                "Examples:\n" +
                "\"learn java programming\" → java tutorial\n" +
                "\"teach me python\" → python tutorial\n" +
                "\"I want to learn JavaScript\" → javascript tutorial\n" +
                "\"web development\" → web development tutorial\n" +
                "\"machine learning basics\" → machine learning tutorial\n\n" +
                "Now extract from: \"" + preference + "\"\n" +
                "Output:";

        String response = callOllamaWithRetry(prompt, 30, 2);

        // Clean the response AGGRESSIVELY
        String topic = cleanTopicResponse(response, preference);

        logger.info("✅ Final topic: '{}'", topic);
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

        // Use more transcript for better context - increase from 5000 to 8000 chars
        String truncated = transcript.length() > 15000
                ? transcript.substring(0, 8000) + "...[content continues]..." +
                transcript.substring(Math.max(0, transcript.length() - 2000))
                : transcript;

        // IMPROVED PROMPT - Focus on actual content extraction
        String prompt = "Analyze this educational video transcript and extract key information.\n\n" +
                "VIDEO: '" + title + "'\n" +
                "TOPIC: '" + topic + "'\n\n" +
                "TRANSCRIPT:\n" + truncated + "\n\n" +
                "Create the following sections:\n\n" +
                "## SUMMARY\n" +
                "Write a 3-paragraph summary that covers:\n" +
                "- What specific concepts/topics are taught (be specific with names, technologies, frameworks)\n" +
                "- What practical skills or projects are built\n" +
                "- Key learning outcomes and what students will be able to do\n" +
                "Focus on CONTENT, not marketing language. Extract actual technical details from the transcript.\n\n" +
                "## QUESTIONS\n" +
                "Create 5 Q&A pairs based on actual content from the transcript:\n" +
                "Q1: [specific question about a concept mentioned]\n" +
                "A1: [answer with specific details from transcript]\n" +
                "(Continue for Q2-Q5)\n\n" +
                "## FLASHCARDS\n" +
                "Create 5 flashcard pairs for key concepts from the transcript:\n" +
                "1. Front: [term/concept from transcript]\n   Back: [definition/explanation from transcript]\n" +
                "(Continue for cards 2-5)\n\n" +
                "IMPORTANT: Base everything on the actual transcript content, not general knowledge.";

        long start = System.currentTimeMillis();
        String response = callOllamaWithRetry(prompt, 1500, 3);
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

            // Final fallback - use entire response as summary
            if (summaryContent.isEmpty()) {
                summaryContent = response.substring(0, Math.min(response.length(), 1000));
                logger.warn("⚠️ Using fallback summary extraction");
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
        prompt.append("Create a structured learning plan for the topic: '").append(topic).append("'\n\n");
        prompt.append("Based on ").append(summaries.size()).append(" educational videos:\n\n");

        int num = 1;
        for (Map.Entry<String, String> entry : summaries.entrySet()) {
            prompt.append("VIDEO ").append(num++).append(": ").append(entry.getKey()).append("\n");
            prompt.append(truncate(entry.getValue(), 300)).append("\n\n");
        }

        prompt.append("\nCreate a learning plan with these sections:\n\n");
        prompt.append("## LEARNING PATH\n");
        prompt.append("Recommend the optimal viewing order (1-").append(summaries.size()).append(") with brief reasoning.\n\n");
        prompt.append("## KEY CONCEPTS\n");
        prompt.append("List 6-8 main concepts that will be learned across all videos.\n\n");
        prompt.append("## LEARNING OUTCOMES\n");
        prompt.append("List 5-6 specific skills or abilities the learner will gain.\n\n");
        prompt.append("## PRACTICE EXERCISES\n");
        prompt.append("Suggest 3-4 hands-on exercises or projects to reinforce learning.\n");

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
            Map<String, Object> body = Map.of(
                    "model", "llama3",
                    "stream", false,
                    "messages", List.of(
                            Map.of("role", "system",
                                    "content", "You are a technical education content analyzer. " +
                                            "Extract specific, factual information from transcripts. " +
                                            "Be precise and detailed. Focus on actual content, not marketing language."),
                            Map.of("role", "user", "content", prompt)
                    ),
                    "options", Map.of(
                            "temperature", 0.3,  // Lower temperature for more focused responses
                            "top_p", 0.9,
                            "num_predict", maxTokens,
                            "num_ctx", 8192,
                            "num_thread", 4
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