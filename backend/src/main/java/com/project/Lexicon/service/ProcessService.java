package com.project.Lexicon.service;

import com.project.Lexicon.domain.entity.User;

import java.util.Map;

public interface ProcessService {
    Map<String, Object> processOnly(String preference);
    Map<String, Object> processAndSave(String preference, User user);
}
