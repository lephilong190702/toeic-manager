package com.example.toeic.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.toeic.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
}
