package com.example.toeic.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "words")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Word {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "vocabulary", nullable = false)
    private String vocabulary;

    @Column(name = "meaning", nullable = false)
    private String meaning;

    @Column(name = "part_of_speech")
    private String partOfSpeech;

    @Column(name = "topic")
    private String topic;

    @Column(name = "level")
    private String level;

    @Column(name = "learned", nullable = false)
    private boolean learned = false;
}
