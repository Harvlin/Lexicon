package com.project.Lexicon.service;

import com.project.Lexicon.domain.entity.OnboardingProfile;

public interface OnboardingService {
    OnboardingProfile getOnboardingProfile();
    OnboardingProfile putOnboardingProfile(OnboardingProfile onboardingProfile);
}
