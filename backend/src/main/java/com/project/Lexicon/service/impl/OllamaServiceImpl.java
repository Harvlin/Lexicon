package com.project.Lexicon.service.impl;

import com.project.Lexicon.service.OllamaService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class OllamaServiceImpl implements OllamaService {

    @Value("${ollama.url}")
    private String ollamaUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String getTopic(String preference) {
        Map<String, String> request = Map.of(
                "model", "llama3",
                "prompt", "Based on this user preference, extract a short YouTube search topic: " + preference
        );
        Map<?, ?> response = restTemplate.postForObject(ollamaUrl, request, Map.class);
        return response != null ? (String) response.get("response") : "Unknown topic";
    }
}
