package com.project.Lexicon.controller;

import com.project.Lexicon.domain.entity.User;
import com.project.Lexicon.service.ScheduleService;
import com.project.Lexicon.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/schedule")
@Slf4j
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final UserService userService;

    @Autowired
    public ScheduleController(ScheduleService scheduleService, UserService userService) {
        this.scheduleService = scheduleService;
        this.userService = userService;
    }

    @GetMapping("/weeks/{weekId}")
    public ResponseEntity<Map<String, Object>> getWeek(
            @PathVariable String weekId,
            Authentication authentication) {
        log.info("GET /api/schedule/weeks/{} - User: {}", weekId, authentication.getName());

        User user = getAuthenticatedUser(authentication);
        Map<String, Object> response = scheduleService.getWeek(user, weekId);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/weeks/{weekId}")
    public ResponseEntity<Map<String, Object>> saveWeek(
            @PathVariable String weekId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        log.info("PUT /api/schedule/weeks/{} - User: {}", weekId, authentication.getName());

        User user = getAuthenticatedUser(authentication);
        Map<String, Object> response = scheduleService.saveWeek(user, weekId, payload);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/weeks/{weekId}/sessions")
    public ResponseEntity<Map<String, Object>> addSession(
            @PathVariable String weekId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        log.info("POST /api/schedule/weeks/{}/sessions - User: {}", weekId, authentication.getName());

        User user = getAuthenticatedUser(authentication);
        Map<String, Object> response = scheduleService.addSession(user, weekId, payload);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/weeks/{weekId}/sessions/{sessionId}")
    public ResponseEntity<Map<String, Object>> updateSession(
            @PathVariable String weekId,
            @PathVariable String sessionId,
            @RequestBody Map<String, Object> patch,
            Authentication authentication) {
        log.info("PATCH /api/schedule/weeks/{}/sessions/{} - User: {}",
                weekId, sessionId, authentication.getName());

        User user = getAuthenticatedUser(authentication);
        Map<String, Object> response = scheduleService.updateSession(user, weekId, sessionId, patch);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/weeks/{weekId}/sessions/{sessionId}")
    public ResponseEntity<Void> deleteSession(
            @PathVariable String weekId,
            @PathVariable String sessionId,
            Authentication authentication) {
        log.info("DELETE /api/schedule/weeks/{}/sessions/{} - User: {}",
                weekId, sessionId, authentication.getName());

        User user = getAuthenticatedUser(authentication);
        scheduleService.deleteSession(user, weekId, sessionId);

        return ResponseEntity.noContent().build();
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        String principal = authentication.getName(); // usually email from JWT
        log.debug("Looking up user with principal: {}", principal);

        return userService.findByEmail(principal)
                .or(() -> userService.findByName(principal))
                .orElseThrow(() -> new RuntimeException("User not found: " + principal));
    }
}
