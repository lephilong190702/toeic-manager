package com.example.toeic.controller.api;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.toeic.dto.StatsResponse;
import com.example.toeic.model.User;
import com.example.toeic.service.AuthService;
import com.example.toeic.service.StatsService;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class StatsController {
    private final StatsService statsService;

    @Autowired
    private AuthService authService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats() {
        User user = authService.getCurrentUser(); // cần có phương thức lấy user hiện tại
        return ResponseEntity.ok(statsService.getStats(user));
    }

    @GetMapping("/stats/history")
    public ResponseEntity<?> getStatsHistory(@RequestParam String range) {
        try {
            User user = authService.getCurrentUser();
            return ResponseEntity.ok(statsService.getStatsHistory(user, range));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
