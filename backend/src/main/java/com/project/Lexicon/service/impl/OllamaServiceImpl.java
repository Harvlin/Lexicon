package com.project.Lexicon.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final ObjectMapper objectMapper;

    public OllamaServiceImpl(RestTemplate restTemplate, @Value("${ollama.api.base-url}") String ollamaBaseUrl, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.ollamaBaseUrl = ollamaBaseUrl;
        this.objectMapper = objectMapper;
    }

    @Override
    public String generateResponse(String prompt) {
         try {
            String url = ollamaBaseUrl + "/api/generate";

            Map<String, Object> body = Map.of(
                    "model", "llama3",
                    "prompt", prompt,
                    "stream", false
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);

            if (response.getBody() != null) {
                JsonNode jsonResponse = objectMapper.readTree(response.getBody());

                if (jsonResponse.has("response")) {
                    return jsonResponse.get("response").asText();
                }
                return "No response from Ollama";
            }

            return response.getBody();
        } catch (Exception e) {
             throw new RuntimeException("Failed to generate response:" + e.getMessage());
         }
    }
}
