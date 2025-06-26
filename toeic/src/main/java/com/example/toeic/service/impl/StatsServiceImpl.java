package com.example.toeic.service.impl;

import com.example.toeic.dto.*;
import com.example.toeic.model.User;
import com.example.toeic.repository.WordRepository;
import com.example.toeic.service.StatsService;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;

@Service
public class StatsServiceImpl implements StatsService {

    private final WordRepository wordRepository;

    public StatsServiceImpl(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    @Override
    public StatsResponse getStats(User user) {
        final long learnedCount = wordRepository.countByUserAndLearnedTrue(user);
        final long unlearnedCount = wordRepository.countByUserAndLearnedFalse(user);

        final List<StatsResponse.LevelCount> levelCounts = wordRepository.countGroupByLevel(user).stream()
                .map(row -> {
                    String level = String.valueOf(row[0]);
                    long count = ((Number) row[1]).longValue();
                    return new StatsResponse.LevelCount(level, count);
                }).toList();

        final List<StatsResponse.TopicCount> topicCounts = wordRepository.countGroupByTopic(user).stream()
                .map(row -> {
                    String topic = String.valueOf(row[0]);
                    long count = ((Number) row[1]).longValue();
                    return new StatsResponse.TopicCount(topic, count);
                }).toList();

        return new StatsResponse(learnedCount, unlearnedCount, levelCounts, topicCounts);
    }

    @Override
    public Object getStatsHistory(User user, String range) {
        Long userId = user.getId();

        return switch (range.toLowerCase()) {
            case "week" -> wordRepository.getWeeklyStats(userId).stream()
                    .map(row -> {
                        Date date = (Date) row[0];
                        long count = ((Number) row[1]).longValue();
                        return new DailyLearningStats(date.toLocalDate(), count);
                    }).toList();
            case "month" -> wordRepository.getMonthlyStats(userId).stream()
                    .map(row -> {
                        String month = (String) row[0];
                        long count = ((Number) row[1]).longValue();
                        return new MonthlyLearningStats(month, count);
                    }).toList();
            case "year" -> wordRepository.getYearlyStats(userId).stream()
                    .map(row -> {
                        int year = ((Number) row[0]).intValue();
                        long count = ((Number) row[1]).longValue();
                        return new YearlyLearningStats(year, count);
                    }).toList();
            default -> throw new IllegalArgumentException("Invalid range: " + range);
        };
    }
}
