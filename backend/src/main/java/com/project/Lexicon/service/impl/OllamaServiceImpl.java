package com.project.Lexicon.service.impl;

import com.project.Lexicon.service.OllamaService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class OllamaServiceImpl implements OllamaService {
    private final RestTemplate restTemplate;
    private final String ollamaBaseUrl;

    public OllamaServiceImpl(RestTemplate restTemplate, @Value("${ollama.api.base-url}") String ollamaBaseUrl) {
        this.restTemplate = restTemplate;
        this.ollamaBaseUrl = ollamaBaseUrl;
    }

    @Override
    public String generateResponse(String prompt) {
        String url = ollamaBaseUrl + "/api/generate";

        Map<String, Object> body = Map.of(
                "model", "llama3",
                "prompt", prompt
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);

        return response.getBody();
    }
}
