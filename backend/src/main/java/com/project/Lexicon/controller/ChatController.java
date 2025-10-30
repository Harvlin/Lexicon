package com.project.Lexicon.controller;

import com.project.Lexicon.service.OllamaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final OllamaService ollamaService;

    public ChatController(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(@RequestParam String prompt) {
        try {
            String response = ollamaService.generateResponse(prompt);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "response", response
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }
}
