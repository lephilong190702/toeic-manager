package com.example.toeic.service.impl;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.toeic.model.Topic;
import com.example.toeic.model.Word;
import com.example.toeic.repository.TopicRepository;
import com.example.toeic.repository.WordRepository;
import com.example.toeic.service.TopicService;

@Service
public class TopicServiceImpl implements TopicService {
    private final TopicRepository topicRepository;
    private final WordRepository wordRepository;

    @Autowired
    public TopicServiceImpl(TopicRepository topicRepository, WordRepository wordRepository) {
        this.topicRepository = topicRepository;
        this.wordRepository = wordRepository;
    }

    @Override
    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    @Override
    public Optional<Topic> getTopicById(Long id) {
        return topicRepository.findById(id);
    }

    @Override
    public Optional<Topic> getTopicByName(String name) {
        return topicRepository.findByNameIgnoreCase(name);
    }

    @Override
    public Topic createTopicIfNotExists(String rawName) {
        String normalized = normalizeTopicName(rawName);
        return topicRepository.findByNameIgnoreCase(normalized)
                .orElseGet(() -> topicRepository.save(new Topic(normalized)));
    }

    private String normalizeTopicName(String raw) {
        if (raw == null)
            return "";

        return Arrays.stream(
                raw
                        .toLowerCase()
                        .replaceAll("&", " and ")
                        .replaceAll("[^a-z0-9 ]", " ")
                        .split("\\s+"))
                .filter(s -> !s.isBlank())
                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1))
                .collect(Collectors.joining(" "));
    }

    @Override
    public List<Word> getLearnedWordsByTopic(Long topicId) {
        return wordRepository.findByTopicIdAndLearnedTrue(topicId);
    }
}
