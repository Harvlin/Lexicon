package com.project.Lexicon.service;

import java.util.Map;

public interface OllamaService {

    /**
     * Generate a search topic from user preference
     */
    String getTopic(String preference);

    /**
     * OPTIMIZED: Generate summary + study materials in ONE call
     * @return Map containing "summary" and "studyMaterials"
     */
    Map<String, Object> generateCombinedMaterials(String transcript, String title, String topic);

    /**
     * Legacy method - now uses combined generation
     */
    String summarizeTranscript(String transcript, String topic);

    /**
     * Legacy method - now uses combined generation
     */
    Map<String, Object> generateStudyMaterials(String transcript, String summary,
                                               String title, String topic);

    /**
     * Generate learning plan from multiple video summaries
     */
    String generateLearningPlan(Map<String, String> summaries, String topic);
}