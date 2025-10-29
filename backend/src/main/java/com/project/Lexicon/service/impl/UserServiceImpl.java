package com.project.Lexicon.service.impl;

import com.project.Lexicon.domain.dto.UserUpdateDto;
import com.project.Lexicon.domain.entity.User;
import com.project.Lexicon.repository.UserRepository;
import com.project.Lexicon.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User editPersonalInfo(String name, User userUpdate) {
        return userRepository.findByName(name).map(user -> {
            Optional.ofNullable(userUpdate.getEmail()).ifPresent(user::setEmail);
            Optional.ofNullable(userUpdate.getName()).ifPresent(user::setName);
            Optional.ofNullable(userUpdate.getBio()).ifPresent(user::setBio);
            Optional.ofNullable(userUpdate.getAvatarUrl()).ifPresent(user::setAvatarUrl);
            user.setUpdatedAt(java.time.LocalDateTime.now());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public User requireCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RuntimeException();
        }
        String principal = auth.getName(); // email is set in JwtAuthFilter
        return userRepository.findByEmail(principal)
                .or(() -> userRepository.findByName(principal)) // fallback if principal was a username
                .orElseThrow(() -> new RuntimeException());
    }


    @Override
    public Optional<User> currentUser() {
        try {
            return Optional.of(requireCurrentUser());
        } catch (ResponseStatusException e) {
            return Optional.empty();
        }
    }
}
