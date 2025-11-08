package com.project.Lexicon.service.impl;

import com.project.Lexicon.domain.entity.*;
import com.project.Lexicon.repository.*;
import com.project.Lexicon.service.StudyMaterialService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class StudyMaterialServiceImpl implements StudyMaterialService {

    private static final Logger log = LoggerFactory.getLogger(StudyMaterialServiceImpl.class);

    private final VideoRepository videoRepository;
    private final SummaryRepository summaryRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final FlashcardRepository flashcardRepository;
    private final LearningPlanRepository learningPlanRepository;

    @Override
    @Transactional
    public Video saveVideoWithMaterials(User user, Map<String, Object> videoData, String topic) {
        try {
            log.debug("💾 Saving video: {}", videoData.get("title"));

            // Create and save video entity
            Video video = createVideoEntity(user, videoData, topic);
            video = videoRepository.save(video);

            // Save summary if present
            saveSummary(video, videoData);

            // Parse and save study materials
            saveStudyMaterials(video, videoData);

            // Save again to persist relationships
            video = videoRepository.save(video);

            log.info("✅ Saved video '{}' with {} questions, {} flashcards",
                    video.getTitle(),
                    video.getQuestions() != null ? video.getQuestions().size() : 0,
                    video.getFlashcards() != null ? video.getFlashcards().size() : 0);

            return video;

        } catch (Exception e) {
            log.error("❌ Failed to save video materials: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save study materials: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public LearningPlan saveLearningPlan(User user, String topic, String planContent, String userPreference) {
        try {
            LearningPlan plan = LearningPlan.builder()
                    .user(user)
                    .topic(topic)
                    .planContent(planContent)
                    .userPreference(userPreference)
                    .build();

            plan = learningPlanRepository.save(plan);
            log.info("✅ Saved learning plan for user {} on topic '{}'", user.getId(), topic);

            return plan;

        } catch (Exception e) {
            log.error("❌ Failed to save learning plan: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save learning plan: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Video> getUserVideos(Long userId) {
        return videoRepository.findByUserId(userId);
    }

    @Override
    public List<Video> getUserVideosByTopic(Long userId, String topic) {
        return videoRepository.findByUserIdAndTopic(userId, topic);
    }

    @Override
    public List<LearningPlan> getUserLearningPlans(Long userId) {
        return learningPlanRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public Video getVideoById(Long videoId, Long userId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found: " + videoId));

        if (!video.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to video");
        }

        return video;
    }

    @Override
    public List<QuizQuestion> getQuizQuestions(Long videoId, Long userId) {
        Video video = getVideoById(videoId, userId);
        return quizQuestionRepository.findByVideoIdOrderByQuestionNumberAsc(video.getId());
    }

    @Override
    public List<Flashcard> getFlashcards(Long videoId, Long userId) {
        Video video = getVideoById(videoId, userId);
        return flashcardRepository.findByVideoIdOrderByCardNumberAsc(video.getId());
    }

    // =============== PRIVATE HELPER METHODS ===============

    private Video createVideoEntity(User user, Map<String, Object> videoData, String topic) {
        Video video = Video.builder()
                .user(user)
                .videoId((String) videoData.get("videoId"))
                .title((String) videoData.get("title"))
                .channelTitle((String) videoData.get("channel"))
                .url((String) videoData.get("url"))
                .topic(topic)
                .build();

        // Set transcript if available
        Map<String, Object> transcriptData = (Map<String, Object>) videoData.get("transcript");
        if (transcriptData != null && transcriptData.containsKey("preview")) {
            video.setTranscript((String) transcriptData.get("preview"));
        }

        return video;
    }

    private void saveSummary(Video video, Map<String, Object> videoData) {
        Map<String, Object> summaryData = (Map<String, Object>) videoData.get("summary");
        if (summaryData != null && summaryData.containsKey("content")) {
            String content = (String) summaryData.get("content");
            if (content != null && !content.trim().isEmpty()) {
                Summary summary = Summary.builder()
                        .video(video)
                        .content(content)
                        .length((Integer) summaryData.getOrDefault("length", content.length()))
                        .build();
                video.setSummary(summary);
                log.debug("  ✓ Summary saved ({} chars)", content.length());
            }
        }
    }

    private void saveStudyMaterials(Video video, Map<String, Object> videoData) {
        Map<String, Object> studyMaterials = (Map<String, Object>) videoData.get("studyMaterials");
        if (studyMaterials == null) {
            log.debug("  ⚠️ No study materials to save");
            return;
        }

        // Parse and save questions
        String questionsText = (String) studyMaterials.get("questions");
        if (isValidContent(questionsText)) {
            List<QuizQuestion> questions = parseQuestions(questionsText, video);
            if (!questions.isEmpty()) {
                questions.forEach(video::addQuestion);
                log.debug("  ✓ {} questions parsed", questions.size());
            }
        }

        // Parse and save flashcards
        String flashcardsText = (String) studyMaterials.get("flashcards");
        if (isValidContent(flashcardsText)) {
            List<Flashcard> flashcards = parseFlashcards(flashcardsText, video);
            if (!flashcards.isEmpty()) {
                flashcards.forEach(video::addFlashcard);
                log.debug("  ✓ {} flashcards parsed", flashcards.size());
            }
        }
    }

    private boolean isValidContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            return false;
        }

        String lowerContent = content.toLowerCase();
        return !lowerContent.contains("could not be extracted") &&
                !lowerContent.contains("see summary") &&
                !lowerContent.equals("flashcards could not be extracted - see summary") &&
                !lowerContent.equals("questions could not be extracted - see summary");
    }

    /**
     * Parse questions in format:
     * Q1: Question text here?
     * A1: Answer text here.
     */
    private List<QuizQuestion> parseQuestions(String text, Video video) {
        List<QuizQuestion> questions = new ArrayList<>();

        // Pattern matches: Q1: question text A1: answer text (until next Q or end)
        Pattern pattern = Pattern.compile(
                "Q(\\d+):\\s*(.+?)\\s*A\\1:\\s*(.+?)(?=(?:Q\\d+:|$))",
                Pattern.DOTALL | Pattern.CASE_INSENSITIVE
        );

        Matcher matcher = pattern.matcher(text);

        while (matcher.find()) {
            try {
                int questionNumber = Integer.parseInt(matcher.group(1));
                String questionText = cleanText(matcher.group(2));
                String answerText = cleanText(matcher.group(3));

                if (!questionText.isEmpty() && !answerText.isEmpty()) {
                    QuizQuestion question = QuizQuestion.builder()
                            .video(video)
                            .questionNumber(questionNumber)
                            .question(questionText)
                            .answer(answerText)
                            .build();

                    questions.add(question);
                }
            } catch (Exception e) {
                log.warn("Failed to parse question {}: {}", matcher.group(1), e.getMessage());
            }
        }

        log.debug("Parsed {} questions from text (length: {})", questions.size(), text.length());
        return questions;
    }

    /**
     * Parse flashcards in format:
     * 1. Front: Front text
     *    Back: Back text
     */
    private List<Flashcard> parseFlashcards(String text, Video video) {
        List<Flashcard> flashcards = new ArrayList<>();

        // Pattern matches: number. Front: front text Back: back text (until next number or end)
        Pattern pattern = Pattern.compile(
                "(\\d+)\\.\\s*Front:\\s*(.+?)\\s*Back:\\s*(.+?)(?=(?:\\d+\\.\\s*Front:|$))",
                Pattern.DOTALL | Pattern.CASE_INSENSITIVE
        );

        Matcher matcher = pattern.matcher(text);

        while (matcher.find()) {
            try {
                int cardNumber = Integer.parseInt(matcher.group(1));
                String front = cleanText(matcher.group(2));
                String back = cleanText(matcher.group(3));

                if (!front.isEmpty() && !back.isEmpty()) {
                    Flashcard flashcard = Flashcard.builder()
                            .video(video)
                            .cardNumber(cardNumber)
                            .front(front)
                            .back(back)
                            .build();

                    flashcards.add(flashcard);
                }
            } catch (Exception e) {
                log.warn("Failed to parse flashcard {}: {}", matcher.group(1), e.getMessage());
            }
        }

        log.debug("Parsed {} flashcards from text (length: {})", flashcards.size(), text.length());
        return flashcards;
    }

    private String cleanText(String text) {
        if (text == null) {
            return "";
        }

        return text
                .trim()
                .replaceAll("\\s+", " ")  // Replace multiple spaces/newlines with single space
                .replaceAll("^[\\s\\n]+|[\\s\\n]+$", "");  // Remove leading/trailing whitespace
    }
}