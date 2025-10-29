package com.project.Lexicon.service.impl;

import com.project.Lexicon.domain.entity.OnboardingProfile;
import com.project.Lexicon.domain.entity.User;
import com.project.Lexicon.repository.OnboardingProfileRepository;
import com.project.Lexicon.repository.UserRepository;
import com.project.Lexicon.service.AuthService;
import com.project.Lexicon.service.OnboardingService;
import com.project.Lexicon.service.UserService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.List;
import java.util.Collections;

@Service
@Transactional
public class OnboardingServiceImpl implements OnboardingService {

    private OnboardingProfileRepository onboardingProfileRepository;
    private final UserService userService;
    private final UserRepository userRepository;

    @Autowired
    public OnboardingServiceImpl(UserService userService, UserRepository userRepository, OnboardingProfileRepository onboardingProfileRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.onboardingProfileRepository = onboardingProfileRepository;
    }

    @Override
    public OnboardingProfile getOnboardingProfile() {
        User user = userService.requireCurrentUser();
        User persistentUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return onboardingProfileRepository.findByUserId(persistentUser.getId())
                .orElseGet(() -> {
                    OnboardingProfile p = new OnboardingProfile();
                    p.setUser(persistentUser);
                    return p;
                });
    }


    @Override
    public OnboardingProfile putOnboardingProfile(OnboardingProfile onboardingProfile) {
        User currentUser = userService.requireCurrentUser();

        User managedUser = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        OnboardingProfile profile = onboardingProfileRepository.findByUserId(managedUser.getId())
                .orElseGet(() -> {
                    OnboardingProfile p = new OnboardingProfile();
                    p.setUser(managedUser);
                    p.setCreatedAt(Instant.now());
                    return p;
                });
        // Ensure the profile references the same managedUser instance
        if (profile.getUser() == null || !managedUser.getId().equals(profile.getUser().getId())) {
            profile.setUser(managedUser);
        }

        Optional.ofNullable(onboardingProfile.getGoalsJson()).ifPresent(profile::setGoalsJson);
        Optional.ofNullable(onboardingProfile.getSkillsJson()).ifPresent(profile::setSkillsJson);
        Optional.ofNullable(onboardingProfile.getSchedulePreset()).ifPresent(profile::setSchedulePreset);
        Optional.ofNullable(onboardingProfile.getDaysOfWeekJson()).ifPresent(profile::setDaysOfWeekJson);
        Optional.ofNullable(onboardingProfile.getSpecificTime()).ifPresent(profile::setSpecificTime);
        Optional.ofNullable(onboardingProfile.getCompletedAt()).ifPresent(profile::setCompletedAt);

        profile.setDailyHours(onboardingProfile.getDailyHours());
        profile.setReminderEnabled(onboardingProfile.isReminderEnabled());
        profile.setUpdatedAt(Instant.now());

        // Also project onboarding goals into the user's primary goals list for quick access
        // (used by /auth login/me responses and other parts of the app)
        try {
            String goalsJson = onboardingProfile.getGoalsJson();
            if (goalsJson != null && !goalsJson.isBlank()) {
                ObjectMapper mapper = new ObjectMapper();
                List<String> goals = mapper.readValue(goalsJson, new TypeReference<List<String>>(){});
                // Avoid null: set empty list if parsing yields null
                List<String> safeGoals = goals != null ? goals : Collections.emptyList();
                managedUser.setGoals(safeGoals);
                // also update the user attached to profile to keep in-memory graph consistent
                if (profile.getUser() != null) {
                    profile.getUser().setGoals(safeGoals);
                }
                userRepository.save(managedUser); // persist immediately so mapper can read updated collection
            }
        } catch (Exception ignored) {
            // Parsing error should not block onboarding save; leave user's goals unchanged
        }

        return onboardingProfileRepository.save(profile);
    }

}
