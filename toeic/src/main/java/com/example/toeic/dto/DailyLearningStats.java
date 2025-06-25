package com.example.toeic.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyLearningStats {
    private LocalDate date;
    private long count;
}
