package com.example.toeic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyLearningStats {
    private String month; 
    private long count;
}


