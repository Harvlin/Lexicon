package com.project.Lexicon.service.impl;

import com.project.Lexicon.domain.ScheduleSource;
import com.project.Lexicon.domain.SessionStatus;
import com.project.Lexicon.domain.entity.Lesson;
import com.project.Lexicon.domain.entity.ScheduleSession;
import com.project.Lexicon.domain.entity.ScheduleWeek;
import com.project.Lexicon.domain.entity.User;
import com.project.Lexicon.repository.LessonRepository;
import com.project.Lexicon.repository.ScheduleWeekRepository;
import com.project.Lexicon.service.ScheduleService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleWeekRepository scheduleWeekRepository;
    private final LessonRepository lessonRepository;

    @Autowired
    public ScheduleServiceImpl(ScheduleWeekRepository scheduleWeekRepository,
                               LessonRepository lessonRepository) {
        this.scheduleWeekRepository = scheduleWeekRepository;
        this.lessonRepository = lessonRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getWeek(User user, String weekId) {
        log.debug("Getting week {} for user {}", weekId, user.getId());

        Optional<ScheduleWeek> weekOpt = scheduleWeekRepository.findByUserAndWeekId(user, weekId);

        if (weekOpt.isEmpty()) {
            // Return empty week structure if not found
            Map<String, Object> response = new HashMap<>();
            response.put("weekId", weekId);
            response.put("sessions", Collections.emptyList());
            response.put("source", "api");
            return response;
        }

        ScheduleWeek week = weekOpt.get();
        return mapWeekToDto(week);
    }

    @Override
    public Map<String, Object> saveWeek(User user, String weekId, Map<String, Object> payload) {
        log.debug("Saving week {} for user {}", weekId, user.getId());

        // 1. Find or create ScheduleWeek
        ScheduleWeek week = scheduleWeekRepository.findByUserAndWeekId(user, weekId)
                .orElseGet(() -> {
                    ScheduleWeek newWeek = ScheduleWeek.builder()
                            .user(user)
                            .weekId(weekId)
                            .createdAt(Instant.now())
                            .sessions(new ArrayList<>())
                            .build();
                    return newWeek;
                });

        // 2. Clear existing sessions (orphanRemoval will handle deletion)
        week.getSessions().clear();

        // 3. Parse source
        String sourceStr = (String) payload.get("source");
        if (sourceStr != null) {
            week.setSource(ScheduleSource.valueOf(sourceStr.toUpperCase()));
        }

        // 4. Process incoming sessions
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> sessionsData = (List<Map<String, Object>>) payload.get("sessions");

        if (sessionsData != null) {
            for (Map<String, Object> sessionData : sessionsData) {
                try {
                    ScheduleSession session = createSessionFromDto(sessionData, week);
                    week.getSessions().add(session);
                } catch (Exception e) {
                    log.warn("Skipping invalid session: {}", e.getMessage());
                    // Skip invalid sessions rather than failing entire request
                }
            }
        }

        week.setUpdatedAt(Instant.now());
        ScheduleWeek savedWeek = scheduleWeekRepository.save(week);

        log.info("Saved week {} with {} sessions", weekId, savedWeek.getSessions().size());
        return mapWeekToDto(savedWeek);
    }

    @Override
    public Map<String, Object> addSession(User user, String weekId, Map<String, Object> payload) {
        log.debug("Adding session to week {} for user {}", weekId, user.getId());

        // 1. Find or create ScheduleWeek
        ScheduleWeek week = scheduleWeekRepository.findByUserAndWeekId(user, weekId)
                .orElseGet(() -> {
                    ScheduleWeek newWeek = ScheduleWeek.builder()
                            .user(user)
                            .weekId(weekId)
                            .source(ScheduleSource.API)
                            .createdAt(Instant.now())
                            .sessions(new ArrayList<>())
                            .build();
                    return newWeek;
                });

        // 2. Create session from payload
        ScheduleSession session = createSessionFromDto(payload, week);

        // 3. Add to week
        week.getSessions().add(session);
        week.setUpdatedAt(Instant.now());

        ScheduleWeek savedWeek = scheduleWeekRepository.save(week);

        // 4. Find the newly created session (it will have an ID after save)
        ScheduleSession savedSession = savedWeek.getSessions().stream()
                .filter(s -> s.getLesson().getId().equals(session.getLesson().getId())
                        && s.getDate().equals(session.getDate()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Failed to retrieve saved session"));

        log.info("Added session {} to week {}", savedSession.getId(), weekId);
        return mapSessionToDto(savedSession);
    }

    @Override
    public Map<String, Object> updateSession(User user, String weekId, String sessionId, Map<String, Object> patch) {
        log.debug("Updating session {} in week {} for user {}", sessionId, weekId, user.getId());

        // 1. Find week and verify ownership
        ScheduleWeek week = scheduleWeekRepository.findByUserAndWeekId(user, weekId)
                .orElseThrow(() -> new EntityNotFoundException("Week not found: " + weekId));

        // 2. Find session
        Long sessionIdLong = Long.parseLong(sessionId);
        ScheduleSession session = week.getSessions().stream()
                .filter(s -> s.getId().equals(sessionIdLong))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Session not found: " + sessionId));

        // 3. Apply partial updates
        if (patch.containsKey("status")) {
            String statusStr = (String) patch.get("status");
            session.setStatus(SessionStatus.valueOf(statusStr.toUpperCase()));
        }

        if (patch.containsKey("actualMinutes")) {
            session.setActualMinutes((Integer) patch.get("actualMinutes"));
        }

        if (patch.containsKey("plannedMinutes")) {
            session.setPlannedMinutes((Integer) patch.get("plannedMinutes"));
        }

        if (patch.containsKey("date")) {
            session.setDate(LocalDate.parse((String) patch.get("date")));
        }

        if (patch.containsKey("focusTag")) {
            session.setFocusTag((String) patch.get("focusTag"));
        }

        if (patch.containsKey("lessonId")) {
            String lessonIdStr = (String) patch.get("lessonId");
            Long lessonId = parseLessonId(lessonIdStr);
            Lesson lesson = lessonRepository.findById(lessonId)
                    .orElseThrow(() -> new EntityNotFoundException("Lesson not found: " + lessonId));
            session.setLesson(lesson);
        }

        // 4. Update timestamps
        session.setUpdatedAt(Instant.now());
        week.setUpdatedAt(Instant.now());

        scheduleWeekRepository.save(week);

        log.info("Updated session {} in week {}", sessionId, weekId);
        return mapSessionToDto(session);
    }

    @Override
    public void deleteSession(User user, String weekId, String sessionId) {
        log.debug("Deleting session {} from week {} for user {}", sessionId, weekId, user.getId());

        // 1. Find week
        ScheduleWeek week = scheduleWeekRepository.findByUserAndWeekId(user, weekId)
                .orElseThrow(() -> new EntityNotFoundException("Week not found: " + weekId));

        // 2. Remove session (orphanRemoval will delete from DB)
        Long sessionIdLong = Long.parseLong(sessionId);
        boolean removed = week.getSessions().removeIf(s -> s.getId().equals(sessionIdLong));

        if (!removed) {
            throw new EntityNotFoundException("Session not found: " + sessionId);
        }

        week.setUpdatedAt(Instant.now());
        scheduleWeekRepository.save(week);

        log.info("Deleted session {} from week {}", sessionId, weekId);
    }

    // ============= Helper Methods =============

    private ScheduleSession createSessionFromDto(Map<String, Object> data, ScheduleWeek week) {
        // Parse lessonId
        String lessonIdStr = (String) data.get("lessonId");
        Long lessonId = parseLessonId(lessonIdStr);

        // Fetch lesson
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found: " + lessonId));

        // Parse status
        String statusStr = (String) data.get("status");
        SessionStatus status = statusStr != null
                ? SessionStatus.valueOf(statusStr.toUpperCase())
                : SessionStatus.PLANNED;

        // Parse date
        String dateStr = (String) data.get("date");
        LocalDate date = LocalDate.parse(dateStr);

        // Build session
        ScheduleSession session = ScheduleSession.builder()
                .week(week)
                .lesson(lesson)
                .date(date)
                .plannedMinutes((Integer) data.get("plannedMinutes"))
                .actualMinutes((Integer) data.get("actualMinutes"))
                .status(status)
                .focusTag((String) data.get("focusTag"))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        // Handle optional id for PUT requests
        if (data.containsKey("id") && data.get("id") != null) {
            String idStr = data.get("id").toString();
            try {
                session.setId(Long.parseLong(idStr));
            } catch (NumberFormatException e) {
                // If ID is UUID or non-numeric, let DB auto-generate
                log.debug("Non-numeric session ID provided, will use auto-generated ID");
            }
        }

        return session;
    }

    private Long parseLessonId(String lessonIdStr) {
        if (lessonIdStr == null) {
            throw new IllegalArgumentException("lessonId is required");
        }

        // Handle "lesson-123" format or plain "123"
        if (lessonIdStr.startsWith("lesson-")) {
            return Long.parseLong(lessonIdStr.substring(7));
        }
        return Long.parseLong(lessonIdStr);
    }

    private Map<String, Object> mapWeekToDto(ScheduleWeek week) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("weekId", week.getWeekId());
        dto.put("source", week.getSource() != null ? week.getSource().name().toLowerCase() : "api");

        List<Map<String, Object>> sessions = week.getSessions().stream()
                .map(this::mapSessionToDto)
                .collect(Collectors.toList());
        dto.put("sessions", sessions);

        return dto;
    }

    private Map<String, Object> mapSessionToDto(ScheduleSession session) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", session.getId().toString());
        dto.put("lessonId", "lesson-" + session.getLesson().getId());
        dto.put("date", session.getDate().toString());
        dto.put("plannedMinutes", session.getPlannedMinutes());
        dto.put("actualMinutes", session.getActualMinutes());
        dto.put("status", session.getStatus().name().toLowerCase());
        dto.put("focusTag", session.getFocusTag());
        dto.put("createdAt", session.getCreatedAt().toString());
        dto.put("updatedAt", session.getUpdatedAt().toString());
        return dto;
    }
}