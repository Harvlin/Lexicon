package com.project.Lexicon.repository;

import com.project.Lexicon.domain.entity.OnboardingProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OnboardingProfileRepository extends JpaRepository<OnboardingProfile, Long> {
    Optional<OnboardingProfile> findByUserId(Long userId);
}
