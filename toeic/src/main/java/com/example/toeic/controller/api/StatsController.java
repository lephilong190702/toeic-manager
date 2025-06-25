package com.example.toeic.controller.api;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import com.example.toeic.dto.StatsResponse;
import com.example.toeic.service.StatsService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class StatsController {
    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats() {
        return ResponseEntity.ok(statsService.getStats());
    }

    @GetMapping("/stats/history")
    public ResponseEntity<?> getStatsHistory(@RequestParam String range) {
        try {
            return ResponseEntity.ok(statsService.getStatsHistory(range));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
