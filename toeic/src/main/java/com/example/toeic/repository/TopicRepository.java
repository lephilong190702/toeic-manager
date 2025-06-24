package com.example.toeic.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.toeic.model.Topic;

import java.util.Optional;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    Optional<Topic> findByNameIgnoreCase(String name);
}
