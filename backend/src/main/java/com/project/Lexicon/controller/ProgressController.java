package com.project.Lexicon.controller;

import com.project.Lexicon.domain.entity.User;
import com.project.Lexicon.service.ProgressService;
import com.project.Lexicon.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@Slf4j
public class ProgressController {

    private final ProgressService progressService;
    private final UserService userService;

    @Autowired
    public ProgressController(ProgressService progressService, UserService userService) {
        this.progressService = progressService;
        this.userService = userService;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(Authentication authentication) {
        log.info("GET /api/progress/summary - User: {}", authentication.getName());

        User user = getAuthenticatedUser(authentication);
        Map<String, Object> summary = progressService.getUserProgressSummary(user);

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/activity/weekly")
    public ResponseEntity<?> getWeeklyActivity(Authentication authentication) {
        log.info("GET /api/progress/activity/weekly - User: {}", authentication.getName());

        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(progressService.getWeeklyActivity(user));
    }

    @GetMapping("/time-stats")
    public ResponseEntity<Map<String, Object>> getTimeStats(Authentication authentication) {
        log.info("GET /api/progress/time-stats - User: {}", authentication.getName());

        User user = getAuthenticatedUser(authentication);
        Map<String, Object> stats = progressService.getTimeStats(user);

        return ResponseEntity.ok(stats);
    }

    // Helper method
    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String principal = authentication.getName();
        return userService.findByEmail(principal)
                .or(() -> userService.findByName(principal))
                .orElseThrow(() -> new RuntimeException("User not found: " + principal));
    }
}