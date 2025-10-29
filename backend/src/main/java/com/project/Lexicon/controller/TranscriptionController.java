package com.project.Lexicon.controller;

import com.project.Lexicon.service.WhisperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/transcribe")
public class TranscriptionController {

    private final WhisperService whisperService;

    @Autowired
    public TranscriptionController(WhisperService whisperService) {
        this.whisperService = whisperService;
    }

    @PostMapping
    public String transcribe(@RequestParam("audio") MultipartFile file) throws IOException {
        File tempFile = File.createTempFile("audio", file.getOriginalFilename());
        file.transferTo(tempFile);

        String result = whisperService.transcribeAudio(tempFile);
        tempFile.delete();

        return result;
    }
}
