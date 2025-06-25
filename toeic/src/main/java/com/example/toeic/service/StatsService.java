package com.example.toeic.service;

import com.example.toeic.dto.StatsResponse;

public interface StatsService {
    StatsResponse getStats();
    Object getStatsHistory(String range);
}
