package com.example.toeic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostcardData {
    private String meaning;
    private String example;
    private String tip;
    private String partOfSpeech;
    private String topic;
    private String level;
}
