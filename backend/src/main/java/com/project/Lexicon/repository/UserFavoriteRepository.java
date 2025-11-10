package com.project.Lexicon.repository;

import com.project.Lexicon.domain.entity.User;
import com.project.Lexicon.domain.entity.UserFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {
    
    // Find favorite by user and lesson
    Optional<UserFavorite> findByUserAndLesson_Id(User user, Long lessonId);
    
    // Find favorite by user and video
    Optional<UserFavorite> findByUserAndVideo_Id(User user, Long videoId);
    
    // Get all favorites for a user
    @Query("SELECT f FROM UserFavorite f LEFT JOIN FETCH f.lesson LEFT JOIN FETCH f.video WHERE f.user = :user ORDER BY f.favoritedAt DESC")
    List<UserFavorite> findAllByUserWithDetails(@Param("user") User user);
    
    // Count user favorites
    long countByUser(User user);
}
