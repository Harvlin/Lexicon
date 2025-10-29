package com.project.Lexicon.repository;

import com.project.Lexicon.domain.Role;
import com.project.Lexicon.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndIsActiveTrue(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    Optional<User> findByName(String username);
    @Query("SELECT u FROM User u WHERE u.isActive = true")
    List<User> findAllActiveUsers();

    long countByRole(Role role);

    User getUserByName(String name);
}
