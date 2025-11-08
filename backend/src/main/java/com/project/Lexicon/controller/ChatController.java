package com.project.Lexicon.controller;

import com.project.Lexicon.service.OllamaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final OllamaService ollamaService;

    @Autowired
    public ChatController(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    @GetMapping("/topic")
    public ResponseEntity<?> getTopic(@RequestParam String preference) {
        try {
            String topic = ollamaService.getTopic(preference);
            return ResponseEntity.ok().body(topic);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ollama error: " + e.getMessage());
        }
    }
}
