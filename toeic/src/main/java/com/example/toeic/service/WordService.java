package com.example.toeic.service;

import java.util.List;

import com.example.toeic.dto.PostcardData;
import com.example.toeic.model.User;
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
    List<Word> getUnlearnedWords();
    List<PostcardData> getUnlearnedPostcards();
    List<Word> getWordsByUser(User user);
    List<PostcardData> getUnlearnedPostcardsForUser(User user);
    List<PostcardData> getLearnedPostcardsForUser(User user);
    List<PostcardData> getLearnedPostcardsByUserAndTopic(User user, String topic);
}
