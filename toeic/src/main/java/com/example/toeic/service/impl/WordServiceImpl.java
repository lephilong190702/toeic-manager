package com.example.toeic.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.toeic.dto.PostcardData;
import com.example.toeic.model.Topic;
import com.example.toeic.model.User;
import com.example.toeic.model.Word;
import com.example.toeic.repository.TopicRepository;
import com.example.toeic.repository.WordRepository;
import com.example.toeic.service.AuthService;
import com.example.toeic.service.WordService;

@Service
public class WordServiceImpl implements WordService {
    private final WordRepository wordRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private AuthService authService;

    public WordServiceImpl(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    @Override
    public List<Word> getAllWords() {
        return wordRepository.findAll();
    }

    @Override
    public Word getWordById(Long id) {
        return wordRepository.findById(id).orElse(null);
    }

    @Override
    public Word saveWord(Word word) {
        return wordRepository.save(word);
    }

    @Override
    public void deleteWord(Long id) {
        wordRepository.deleteById(id);
    }

    @Override
    public List<Word> findWordsByTopic(String name) {
        Topic topic = topicRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new IllegalArgumentException("Topic not found: " + name));
        return wordRepository.findByTopic(topic);
    }

    @Override
    public List<Word> findWordsByLevel(String level) {
        return wordRepository.findByLevel(level);
    }

    @Override
    public Word toggleLearned(Long id) {
        Word word = getWordById(id);
        if (word == null || !word.getUser().getId().equals(authService.getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized or word not found");
        }
        if (word != null) {
            boolean isNowLearned = !word.isLearned();
            word.setLearned(isNowLearned);
            word.setLearnedAt(isNowLearned ? LocalDate.now() : null);
            return wordRepository.save(word);
        }
        return null;
    }

    @Override
    public Word updateWord(Long id, Word updateWord) {
        Word word = wordRepository.findById(id).orElse(null);
        if (word == null || !word.getUser().getId().equals(authService.getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized or word not found");
        }
        if (updateWord != null) {
            word.setVocabulary(updateWord.getVocabulary());
            word.setMeaning(updateWord.getMeaning());
            word.setPartOfSpeech(updateWord.getPartOfSpeech());
            word.setTopic(updateWord.getTopic());
            word.setLevel(updateWord.getLevel());
            word.setLearned(updateWord.isLearned());
            return wordRepository.save(word);
        }
        return null;
    }

    @Override
    public List<Word> getUnlearnedWords() {
        return wordRepository.findByLearnedFalse();
    }

    @Override
    public List<PostcardData> getUnlearnedPostcards() {
        return wordRepository.findByLearnedFalse().stream()
                .map(this::convertToPostcardData)
                .collect(Collectors.toList());
    }

    private PostcardData convertToPostcardData(Word word) {
        PostcardData data = new PostcardData();
        data.setId(word.getId());
        data.setVocabulary(word.getVocabulary());
        data.setMeaning(word.getMeaning());
        data.setExample(word.getExample());
        data.setTip(word.getTip());
        data.setPartOfSpeech(word.getPartOfSpeech());
        data.setTopic(word.getTopic() != null ? word.getTopic().getName() : "");
        data.setLevel(word.getLevel());
        data.setIpa(word.getIpa());
        data.setAudioUrl(word.getAudioUrl());
        data.setError(false);
        return data;
    }

    @Override
    public List<Word> getWordsByUser(User user) {
        return wordRepository.findByUser(user);
    }

    @Override
    public List<PostcardData> getUnlearnedPostcardsForUser(User user) {
        return wordRepository.findByLearnedFalseAndUser(user).stream()
                .map(this::convertToPostcardData)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostcardData> getLearnedPostcardsForUser(User user) {
        return wordRepository.findByLearnedTrueAndUser(user).stream()
                .map(this::convertToPostcardData)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostcardData> getLearnedPostcardsByUserAndTopic(User user, String topic) {
        List<Word> words;
        if (topic == null || topic.isBlank()) {
            words = wordRepository.findByLearnedTrueAndUser(user);
        } else {
            words = wordRepository.findByLearnedTrueAndUserAndTopic_NameIgnoreCase(user, topic.trim());
        }

        return words.stream()
                .map(this::convertToPostcardData)
                .collect(Collectors.toList());
    }
}