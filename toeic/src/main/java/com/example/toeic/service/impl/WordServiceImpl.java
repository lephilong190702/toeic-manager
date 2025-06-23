package com.example.toeic.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.toeic.model.Word;
import com.example.toeic.repository.WordRepository;
import com.example.toeic.service.WordService;

@Service
public class WordServiceImpl implements WordService{
    private final WordRepository wordRepository;

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
    public List<Word> findWordsByTopic(String topic) {
        return wordRepository.findByTopic(topic);
    }

    @Override
    public List<Word> findWordsByLevel(String level) {
        return wordRepository.findByLevel(level);
    }

    @Override
    public Word toggleLearned(Long id) {
        Word word = getWordById(id);
        if(word != null){
            word.setLearned(!word.isLearned());
            return wordRepository.save(word);
        }
        return null;
    }

    @Override
    public Word updateWord(Long id, Word updateWord) {
        Word word = wordRepository.findById(id).orElse(null);
        if(updateWord != null){
            word.setVocabulary(updateWord.getVocabulary());;
            word.setMeaning(updateWord.getMeaning());
            word.setPartOfSpeech(updateWord.getPartOfSpeech());
            word.setTopic(updateWord.getTopic());
            word.setLevel(updateWord.getLevel());
            word.setLearned(updateWord.isLearned());
            return wordRepository.save(word);
        }
        return null;
    }
    
}
