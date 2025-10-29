package com.project.Lexicon.controller;

import com.project.Lexicon.service.OllamaService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final OllamaService ollamaService;

    public ChatController(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    @PostMapping
    public String chat(@RequestParam String prompt) {
        return ollamaService.generateResponse(prompt);
    }
}
