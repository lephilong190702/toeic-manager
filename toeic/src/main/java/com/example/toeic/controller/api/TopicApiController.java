package com.example.toeic.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.toeic.model.Topic;
import com.example.toeic.model.Word;
import com.example.toeic.service.TopicService;

@RestController
@RequestMapping("/api/topics")
public class TopicApiController {
    @Autowired
    private TopicService topicService;

    // 1. Lấy tất cả topic
    @GetMapping
    public List<Topic> getAllTopics() {
        return topicService.getAllTopics();
    }

    // 2. Lấy các từ đã học theo topic
    @GetMapping("/{id}/words/learned")
    public ResponseEntity<List<Word>> getLearnedWordsByTopic(@PathVariable Long id) {
        List<Word> words = topicService.getLearnedWordsByTopic(id);
        return ResponseEntity.ok(words);
    }

    // (Tùy chọn) 3. Tạo topic mới
    @PostMapping
    public ResponseEntity<Topic> createTopic(@RequestBody Topic topic) {
        Topic created = topicService.createTopicIfNotExists(topic.getName());
        return ResponseEntity.ok(created);
    }
}
