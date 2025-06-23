package com.example.toeic.service;

import java.util.List;

import com.example.toeic.model.Word;

public interface WordService {
    List<Word> getAllWords();
    Word getWordById(Long id);
    Word saveWord(Word word);
    Word updateWord(Long id, Word word);
    void deleteWord(Long id);
    List<Word> findWordsByTopic(String topic);
    List<Word> findWordsByLevel(String level);
    Word toggleLearned(Long id);
}
