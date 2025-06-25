package com.example.toeic.service.impl;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.toeic.dto.DailyLearningStats;
import com.example.toeic.dto.MonthlyLearningStats;
import com.example.toeic.dto.StatsResponse;
import com.example.toeic.dto.YearlyLearningStats;
import com.example.toeic.repository.WordRepository;
import com.example.toeic.service.StatsService;

@Service
public class StatsServiceImpl implements StatsService {

    @Autowired
    private WordRepository wordRepository;

    @Override
    public StatsResponse getStats() {
        final long learnedCount = wordRepository.countByLearnedTrue();
        final long unlearnedCount = wordRepository.countByLearnedFalse();

        final List<StatsResponse.LevelCount> levelCounts = wordRepository.countGroupByLevel().stream()
                .map(row -> {
                    String level = String.valueOf(row.get("level"));
                    long count = ((Number) row.get("count")).longValue();
                    return new StatsResponse.LevelCount(level, count);
                })
                .toList();

        final List<StatsResponse.TopicCount> topicCounts = wordRepository.countGroupByTopic().stream()
                .map(row -> {
                    String topic = String.valueOf(row.get("topic"));
                    long count = ((Number) row.get("count")).longValue();
                    return new StatsResponse.TopicCount(topic, count);
                })
                .toList();

        return new StatsResponse(learnedCount, unlearnedCount, levelCounts, topicCounts);
    }

    @Override
    public Object getStatsHistory(String range) {
        return switch (range.toLowerCase()) {
            case "week" -> mapWeeklyStats();
            case "month" -> mapMonthlyStats();
            case "year" -> mapYearlyStats();
            default -> throw new IllegalArgumentException("Invalid range: " + range);
        };
    }

    private List<DailyLearningStats> mapWeeklyStats() {
        return wordRepository.getWeeklyStats().stream()
                .map(row -> {
                    Date date = (Date) row[0];
                    long count = ((Number) row[1]).longValue();
                    return new DailyLearningStats(date.toLocalDate(), count);
                })
                .toList();
    }

    private List<MonthlyLearningStats> mapMonthlyStats() {
        return wordRepository.getMonthlyStats().stream()
                .map(row -> {
                    String month = (String) row[0];
                    long count = ((Number) row[1]).longValue();
                    return new MonthlyLearningStats(month, count);
                })
                .toList();
    }

    private List<YearlyLearningStats> mapYearlyStats() {
        return wordRepository.getYearlyStats().stream()
                .map(row -> {
                    int year = ((Number) row[0]).intValue();
                    long count = ((Number) row[1]).longValue();
                    return new YearlyLearningStats(year, count);
                })
                .toList();
    }
}
