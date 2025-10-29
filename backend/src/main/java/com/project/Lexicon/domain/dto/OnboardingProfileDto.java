package com.project.Lexicon.domain.dto;

import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OnboardingProfileDto {

    private Long id;
    private UserDto user;

    // Arrays for clean API contract; mapper will convert to/from JSON columns
    private List<String> goals;
    private List<String> skills;

    private double dailyHours;
    private String schedulePreset; // Morning/Afternoon/Evening/Late Night/Custom
    private List<String> daysOfWeek; // when Custom
    private String specificTime; // HH:mm when Custom
    private boolean reminderEnabled;

    private Instant completedAt;
    private Instant createdAt;
    private Instant updatedAt;
}
