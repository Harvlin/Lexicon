package com.project.Lexicon.service;

import com.project.Lexicon.domain.entity.User;

import java.util.Optional;

public interface UserService {
    User editPersonalInfo(String name, User userUpdate);
    User requireCurrentUser();
    Optional<User> currentUser();
}
