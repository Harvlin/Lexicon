package com.project.Lexicon.controller;

import com.project.Lexicon.domain.dto.OnboardingProfileDto;
import com.project.Lexicon.domain.entity.OnboardingProfile;
import com.project.Lexicon.mapper.OnboardingMapper;
import com.project.Lexicon.service.OnboardingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/onboarding")
public class OnBoardingController {
    private final OnboardingService onboardingService;
    private final OnboardingMapper onboardingMapper;

    @Autowired
    public OnBoardingController(OnboardingService onboardingService, OnboardingMapper onboardingMapper) {
        this.onboardingService = onboardingService;
        this.onboardingMapper = onboardingMapper;
    }

    @GetMapping("/me")
    public ResponseEntity<OnboardingProfileDto> getOnboardingProfiles() {
        OnboardingProfile onboardingProfile = onboardingService.getOnboardingProfile();
        return ResponseEntity.ok(onboardingMapper.toDto(onboardingProfile));
    }

    @PutMapping("/me")
    public ResponseEntity<OnboardingProfileDto> saveOnboarding(@RequestBody OnboardingProfileDto onboardingProfileDto) {
        OnboardingProfile onboardingProfile = onboardingMapper.toEntity(onboardingProfileDto);
        OnboardingProfile updatedProfile = onboardingService.putOnboardingProfile(onboardingProfile);
        return ResponseEntity.ok(onboardingMapper.toDto(updatedProfile));
    }
}
