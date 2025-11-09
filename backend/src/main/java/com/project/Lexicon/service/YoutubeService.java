package com.project.Lexicon.service;

import com.project.Lexicon.domain.entity.Video;

import java.util.List;
import java.util.Map;

public interface YoutubeService {
    List<Video> searchVideos(String topic);
    
    /**
     * Get video durations in minutes from YouTube API
     * @param videoIds List of YouTube video IDs
     * @return Map of videoId -> duration in minutes
     */
    Map<String, Integer> getVideoDurations(List<String> videoIds);
}
