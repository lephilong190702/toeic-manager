package com.example.toeic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.toeic.model.Topic;
import com.example.toeic.model.Word;

public interface WordRepository extends JpaRepository<Word, Long>{
    List<Word> findByTopic(Topic topic);
    List<Word> findByLevel(String level);
    Optional<Word> findByVocabularyIgnoreCase(String vocabulary);
    List<Word> findByTopicIdAndLearnedTrue(Long topicId);

}
