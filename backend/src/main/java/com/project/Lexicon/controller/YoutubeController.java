package com.project.Lexicon.controller;

import com.project.Lexicon.service.YoutubeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/youtube")
public class YoutubeController {
    private final YoutubeService youtubeService;

    public YoutubeController(YoutubeService youtubeService) {
        this.youtubeService = youtubeService;
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String query) {
        try {
            return ResponseEntity.ok(youtubeService.searchVideos(query));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("YouTube error: " + e.getMessage());
        }
    }
}
