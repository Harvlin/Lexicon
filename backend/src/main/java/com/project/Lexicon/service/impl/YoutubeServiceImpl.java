package com.project.Lexicon.service.impl;

import com.project.Lexicon.service.YoutubeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class YoutubeServiceImpl implements YoutubeService {

    @Value("${youtube.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public Map<String, String> searchVideos(String query) {
        String url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q="
                + query + "&key=" + apiKey;

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        Map<String, String> results = new LinkedHashMap<>();

        if (response != null && response.containsKey("items")) {
            var items = (Iterable<Map<String, Object>>) response.get("items");
            for (Map<String, Object> item : items) {
                Map<String, Object> id = (Map<String, Object>) item.get("id");
                Map<String, Object> snippet = (Map<String, Object>) item.get("snippet");
                String videoId = (String) id.get("videoId");
                String title = (String) snippet.get("title");
                results.put(title, "https://www.youtube.com/watch?v=" + videoId);
            }
        }
        return results;
    }
}
