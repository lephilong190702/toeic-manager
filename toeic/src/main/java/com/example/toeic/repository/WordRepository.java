package com.example.toeic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.toeic.model.Word;

public interface WordRepository extends JpaRepository<Word, Long>{
    List<Word> findByTopic(String topic);
    List<Word> findByLevel(String level);
    Optional<Word> findByVocabularyIgnoreCase(String vocabulary);
}
