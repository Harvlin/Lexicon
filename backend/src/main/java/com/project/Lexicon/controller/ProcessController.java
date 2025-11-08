package com.project.Lexicon.controller;

import com.project.Lexicon.domain.entity.User;
import com.project.Lexicon.service.ProcessService;
import com.project.Lexicon.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/process")
@RequiredArgsConstructor
public class ProcessController {

    private static final Logger log = LoggerFactory.getLogger(ProcessController.class);

    private final ProcessService processService;
    private final UserService userService;

    @GetMapping("/preference")
    public ResponseEntity<Map<String, Object>> processPreference(
            @RequestParam String preference,
            Authentication authentication) {

        log.info("📥 Processing preference: '{}'", preference);

        try {
            // Get authenticated user (if available)
            User user = getAuthenticatedUser(authentication);

            if (user != null) {
                log.info("👤 Authenticated user: {} (ID: {}) - Email: {}",
                        user.getName(), user.getId(), user.getEmail());
            } else {
                log.warn("⚠️ No authenticated user - materials will NOT be saved");
            }

            // Process preferences with automatic save
            log.info("🔄 Calling processAndSave with user: {}", user != null ? user.getId() : "null");
            Map<String, Object> result = processService.processAndSave(preference, user);

            log.info("💾 Save status: {}", result.get("savedToDatabase"));

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("❌ Processing failed: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "status", "error",
                            "message", e.getMessage(),
                            "userPreference", preference
                    ));
        }
    }

    @GetMapping("/preference/preview")
    public ResponseEntity<Map<String, Object>> processPreferencePreview(
            @RequestParam String preference) {

        log.info("📥 Processing preference (preview only): '{}'", preference);

        try {
            Map<String, Object> result = processService.processOnly(preference);
            result.put("savedToDatabase", false);
            result.put("mode", "preview");

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("❌ Processing failed: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "status", "error",
                            "message", e.getMessage(),
                            "userPreference", preference
                    ));
        }
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        String principal = authentication.getName(); // Usually email from JWT
        if ("anonymousUser".equals(principal)) {
            return null;
        }

        try {
            // Try email first (most common in JWT), then fallback to username
            return userService.findByEmail(principal)
                    .or(() -> userService.findByName(principal))
                    .orElse(null);
        } catch (Exception e) {
            log.warn("Failed to get user: {}", e.getMessage());
            return null;
        }
    }
}