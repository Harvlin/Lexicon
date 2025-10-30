package com.project.Lexicon.service;

import java.util.Map;

public interface YoutubeService {
    Map<String, String> searchVideos(String query);
}
