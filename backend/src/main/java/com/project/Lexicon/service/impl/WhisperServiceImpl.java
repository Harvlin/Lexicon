package com.project.Lexicon.service.impl;

import com.project.Lexicon.service.WhisperService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.File;

@Service
public class WhisperServiceImpl implements WhisperService {

    private final RestTemplate restTemplate;
    private final String whisperBaseUrl;

    public WhisperServiceImpl(RestTemplate restTemplate, @Value("${fasterwhisper.api.base-url") String whisperBaseUrl) {
        this.restTemplate = restTemplate;
        this.whisperBaseUrl = whisperBaseUrl;
    }

    @Override
    public String transcribeAudio(File audioFile) {
        String url = whisperBaseUrl + "/transcribe";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("audio_file", new FileSystemResource(audioFile));

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.POST, requestEntity, String.class
        );

        return response.getBody();
    }
}
