package com.example.toeic.service;

import java.util.List;
import java.util.Optional;

import com.example.toeic.model.Topic;
import com.example.toeic.model.Word;

public interface TopicService {
    List<Topic> getAllTopics();

    List<Word> getLearnedWordsByTopic(Long topicId);

    Optional<Topic> getTopicById(Long id);

    Optional<Topic> getTopicByName(String name);

    Topic createTopicIfNotExists(String name);
}
