package com.project.Lexicon.service.impl;

import com.project.Lexicon.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ProcessServiceImpl implements ProcessService {

    private final OllamaService ollamaService;
    private final YoutubeService youtubeService;
    private final TranscriptionService transcriptionService;

    @Autowired
    public ProcessServiceImpl(OllamaService ollamaService, YoutubeService youtubeService, TranscriptionService transcriptionService) {
        this.ollamaService = ollamaService;
        this.youtubeService = youtubeService;
        this.transcriptionService = transcriptionService;
    }

    @Override
    public Map<String, Object> processUserPreferences(String preferences) {
        Map<String, Object> response = new HashMap<>();

        // Step 1: Get context/topic from Ollama
        String interpretedTopic = ollamaService.getTopic(preferences);
        response.put("ollama_topic", interpretedTopic);

        // Step 2: Search YouTube
        var videos = youtubeService.searchVideos(interpretedTopic);
        response.put("youtube_videos", videos);

        // Step 3: Transcribe top 5 videos
        Map<String, String> transcripts = new HashMap<>();
        videos.forEach((title, url) -> {
            try {
                transcripts.put(title, transcriptionService.transcribeFromYouTube(url));
            } catch (Exception e) {
                transcripts.put(title, "Transcription failed: " + e.getMessage());
            }
        });
        response.put("transcripts", transcripts);

        return response;
    }
}