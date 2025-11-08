package com.project.Lexicon.service;

import com.project.Lexicon.domain.entity.*;

import java.util.List;
import java.util.Map;

public interface StudyMaterialService {

    Video saveVideoWithMaterials(User user, Map<String, Object> videoData, String topic);

    LearningPlan saveLearningPlan(User user, String topic, String planContent, String userPreference);

    List<Video> getUserVideos(Long userId);

    List<Video> getUserVideosByTopic(Long userId, String topic);

    List<LearningPlan> getUserLearningPlans(Long userId);

    Video getVideoById(Long videoId, Long userId);

    List<QuizQuestion> getQuizQuestions(Long videoId, Long userId);

    List<Flashcard> getFlashcards(Long videoId, Long userId);
}

