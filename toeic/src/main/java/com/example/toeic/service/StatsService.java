package com.example.toeic.service;

import com.example.toeic.dto.StatsResponse;
import com.example.toeic.model.User;

public interface StatsService {
    StatsResponse getStats(User user);
    Object getStatsHistory(User user, String range);
}
