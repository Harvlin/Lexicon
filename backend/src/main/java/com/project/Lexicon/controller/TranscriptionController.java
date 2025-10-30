package com.project.Lexicon.controller;

import com.project.Lexicon.service.TranscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transcribe")
@RequiredArgsConstructor
public class TranscriptionController {

    private final TranscriptionService transcriptionService;

    @PostMapping
    public ResponseEntity<String> transcribe(@RequestParam String youtubeUrl) {
        String transcript = transcriptionService.transcribeFromYoutube(youtubeUrl);
        return ResponseEntity.ok(transcript);
    }
}
