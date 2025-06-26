package com.example.toeic.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "word")
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

    @Column(name = "meaning")
    private String meaning;

    @Column(name = "example")
    private String example;

    @Column(name = "tip")
    private String tip;

    @Column(name = "part_of_speech")
    private String partOfSpeech;

    @Column(name = "level")
    private String level;

    @Column(name = "learned", nullable = false)
    private boolean learned = false;

    @Column(name = "ipa")
    private String ipa;

    @Column(name = "audio", length = 512)
    private String audioUrl;

    @Column(name = "learned_at")
    private LocalDate learnedAt;

    @ManyToOne
    @JoinColumn(name = "topic_id")
    @JsonIgnore
    private Topic topic;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

}
