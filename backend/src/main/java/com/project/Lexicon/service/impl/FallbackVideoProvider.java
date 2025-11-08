package com.project.Lexicon.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FallbackVideoProvider {

    private static final Logger logger = LoggerFactory.getLogger(FallbackVideoProvider.class);

    // ONLY videos verified to have working English captions
    private static final Map<String, Map<String, String>> FALLBACK_VIDEOS = new HashMap<>();

    static {
        // Programming Basics - VERIFIED WITH CAPTIONS
        FALLBACK_VIDEOS.put("python", Map.of(
                "Python for Beginners - Learn Python in 1 Hour",
                "https://www.youtube.com/watch?v=kqtD5dpn9C8",
                "Python Tutorial for Beginners (with mini-projects)",
                "https://www.youtube.com/watch?v=qwAFL1597eM"
        ));

        FALLBACK_VIDEOS.put("javascript", Map.of(
                "JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour",
                "https://www.youtube.com/watch?v=W6NZfCO5SIk",
                "JavaScript Crash Course For Beginners",
                "https://www.youtube.com/watch?v=hdI2bqOjy3c"
        ));

        FALLBACK_VIDEOS.put("java", Map.of(
                "Java Tutorial for Beginners",
                "https://www.youtube.com/watch?v=eIrMbAQSU34",
                "Java Programming for Beginners – Full Course",
                "https://www.youtube.com/watch?v=A74TOX803D0"
        ));

        // Web Development - VERIFIED
        FALLBACK_VIDEOS.put("html", Map.of(
                "HTML Tutorial for Beginners: HTML Crash Course",
                "https://www.youtube.com/watch?v=qz0aGYrrlhU",
                "HTML Crash Course For Absolute Beginners",
                "https://www.youtube.com/watch?v=UB1O30fR-EE"
        ));

        FALLBACK_VIDEOS.put("css", Map.of(
                "CSS Crash Course For Absolute Beginners",
                "https://www.youtube.com/watch?v=yfoY53QXEnI",
                "CSS Tutorial - Zero to Hero",
                "https://www.youtube.com/watch?v=1Rs2ND1ryYc"
        ));

        FALLBACK_VIDEOS.put("react", Map.of(
                "React Tutorial for Beginners",
                "https://www.youtube.com/watch?v=SqcY0GlETPk",
                "React JS Course for Beginners 2024",
                "https://www.youtube.com/watch?v=cd3P3yXyx30"
        ));

        // Database - VERIFIED
        FALLBACK_VIDEOS.put("sql", Map.of(
                "SQL Tutorial - Full Database Course for Beginners",
                "https://www.youtube.com/watch?v=HXV3zeQKqGY",
                "MySQL Tutorial for Beginners - Full Course",
                "https://www.youtube.com/watch?v=7S_tz1z_5bA"
        ));

        // Git - VERIFIED
        FALLBACK_VIDEOS.put("git", Map.of(
                "Git and GitHub for Beginners - Crash Course",
                "https://www.youtube.com/watch?v=RGOj5yH7evk",
                "Git Tutorial for Beginners: Learn Git in 1 Hour",
                "https://www.youtube.com/watch?v=8JJ101D3knE"
        ));

        // Machine Learning - VERIFIED working transcripts
        FALLBACK_VIDEOS.put("machine learning", Map.of(
                "Machine Learning Tutorial Python - 1: What is Machine Learning?",
                "https://www.youtube.com/watch?v=gmvvaobm7eQ",
                "Machine Learning Basics | What Is Machine Learning?",
                "https://www.youtube.com/watch?v=ukzFI9rgwfU"
        ));

        // Data Science - VERIFIED
        FALLBACK_VIDEOS.put("data science", Map.of(
                "Data Science In 5 Minutes | Data Science For Beginners",
                "https://www.youtube.com/watch?v=X3paOmcrTjQ",
                "What is Data Science?",
                "https://www.youtube.com/watch?v=KdgQvgE3ji4"
        ));

        // Docker - VERIFIED
        FALLBACK_VIDEOS.put("docker", Map.of(
                "Docker Tutorial for Beginners",
                "https://www.youtube.com/watch?v=fqMOX6JJhGo",
                "you need to learn Docker RIGHT NOW!!",
                "https://www.youtube.com/watch?v=eGz9DS-aIeY"
        ));

        // General programming - VERIFIED
        FALLBACK_VIDEOS.put("programming", Map.of(
                "How to Learn to Code - 8 Hard Truths",
                "https://www.youtube.com/watch?v=NtfbWkxJTHw",
                "How I Would Learn To Code (If I Could Start Over)",
                "https://www.youtube.com/watch?v=k9WqpQp8VSU"
        ));

        FALLBACK_VIDEOS.put("tutorial", Map.of(
                "How to Learn to Code - Best Resources",
                "https://www.youtube.com/watch?v=WGvJa8QVYJM",
                "Programming Tutorial for Beginners",
                "https://www.youtube.com/watch?v=zOjov-2OZ0E"
        ));
    }

    public boolean hasFallbackFor(String topic) {
        if (topic == null || topic.trim().isEmpty()) {
            return false;
        }

        String normalized = normalizeTopicForMatching(topic);

        // Check direct match
        if (FALLBACK_VIDEOS.containsKey(normalized)) {
            return true;
        }

        // Check if any key contains or is contained by the topic
        for (String key : FALLBACK_VIDEOS.keySet()) {
            if (normalized.contains(key) || key.contains(normalized)) {
                return true;
            }
        }

        // Check word-by-word
        String[] words = normalized.split("\\s+");
        for (String word : words) {
            if (word.length() > 3 && FALLBACK_VIDEOS.containsKey(word)) {
                return true;
            }
        }

        return false;
    }

    public Map<String, String> getFallbackVideos(String topic) {
        if (topic == null || topic.trim().isEmpty()) {
            logger.warn("Empty topic, returning general programming videos");
            return FALLBACK_VIDEOS.getOrDefault("programming", Map.of());
        }

        String normalized = normalizeTopicForMatching(topic);

        // Try exact match
        if (FALLBACK_VIDEOS.containsKey(normalized)) {
            logger.info("✓ Exact match fallback for: '{}'", topic);
            return FALLBACK_VIDEOS.get(normalized);
        }

        // Try partial match
        for (Map.Entry<String, Map<String, String>> entry : FALLBACK_VIDEOS.entrySet()) {
            String key = entry.getKey();
            if (normalized.contains(key) || key.contains(normalized)) {
                logger.info("✓ Partial match fallback: '{}' → '{}'", topic, key);
                return entry.getValue();
            }
        }

        // Try word match
        String[] words = normalized.split("\\s+");
        for (String word : words) {
            if (word.length() > 3 && FALLBACK_VIDEOS.containsKey(word)) {
                logger.info("✓ Word match fallback: '{}' contains '{}'", topic, word);
                return FALLBACK_VIDEOS.get(word);
            }
        }

        // Default fallback
        logger.warn("No specific match for '{}', using general tutorial", topic);
        return FALLBACK_VIDEOS.getOrDefault("tutorial", Map.of());
    }

    private String normalizeTopicForMatching(String topic) {
        return topic.toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", " ");
    }

    public Set<String> getAvailableTopics() {
        return FALLBACK_VIDEOS.keySet();
    }

    public boolean isFallbackVideo(String url) {
        if (url == null) return false;
        return FALLBACK_VIDEOS.values().stream()
                .anyMatch(videos -> videos.containsValue(url));
    }
}