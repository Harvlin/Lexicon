package com.project.Lexicon.service;

import com.project.Lexicon.domain.entity.User;

import java.util.Optional;

public interface UserService {
    User editPersonalInfo(String name, User userUpdate);
    User requireCurrentUser();
    Optional<User> currentUser();
    Optional<User> findByName(String name);
    Optional<User> findByEmail(String email);
    User updateAvatar(String avatarUrl);
}
