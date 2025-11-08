package com.project.Lexicon.service;

import com.project.Lexicon.domain.entity.Video;

import java.util.List;

public interface YoutubeService {
    List<Video> searchVideos(String topic);
}
