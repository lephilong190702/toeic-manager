package com.example.toeic.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatsResponse {
    private long learnedWords;
    private long unlearnedWords;
    private List<LevelCount> byLevel;
    private List<TopicCount> byTopic;

    @Data
    @AllArgsConstructor
    public static class LevelCount {
        private String level;
        private long count;
    }

    @Data
    @AllArgsConstructor
    public static class TopicCount {
        private String topic;
        private long count;
    }
}
