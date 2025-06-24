package com.example.toeic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostcardData {
    private Long id;
    private String vocabulary;
    private String meaning;
    private String example;
    private String tip;
    private String partOfSpeech;
    private String topic;
    private String level;
    private String ipa;
    private String audioUrl;
    private boolean error = false;          
    private String errorMessage = null;

    public PostcardData(String meaning, String example, String tip,
            String partOfSpeech, String topic, String level) {
        this.meaning = meaning;
        this.example = example;
        this.tip = tip;
        this.partOfSpeech = partOfSpeech;
        this.topic = topic;
        this.level = level;
    }
}
