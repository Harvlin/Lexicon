package com.project.Lexicon.repository;

import com.project.Lexicon.domain.entity.User;
import com.project.Lexicon.domain.entity.UserBadge;
import com.project.Lexicon.domain.entity.UserBadgeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, UserBadgeId> {

    @Query("SELECT ub FROM UserBadge ub JOIN FETCH ub.badge WHERE ub.user = :user")
    List<UserBadge> findByUserWithBadges(@Param("user") User user);
}