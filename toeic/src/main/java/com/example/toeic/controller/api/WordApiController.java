package com.example.toeic.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.toeic.dto.PostcardData;
import com.example.toeic.model.Word;
import com.example.toeic.service.AIPostcartService;
import com.example.toeic.service.WordService;

@RestController
@RequestMapping("/api/words")
@CrossOrigin(origins = "http://localhost:5173")
public class WordApiController {
    @Autowired
    private WordService wordService;
    @Autowired
    private AIPostcartService aiPostcardService;

    // GET /api/words
    @GetMapping
    public ResponseEntity<List<Word>> getAllWords() {
        List<Word> words = wordService.getAllWords();
        return ResponseEntity.ok(words);
    }

    // GET /api/words/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Word> getWordById(@PathVariable Long id) {
        Word word = wordService.getWordById(id);
        if (word == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(word);
    }

    // POST /api/words
    @PostMapping
    public ResponseEntity<Word> saveWord(@RequestBody Word word) {
        PostcardData data = aiPostcardService.generatePostcard(word.getVocabulary());
        word.setMeaning(data.getMeaning());
        word.setExample(data.getExample());
        word.setTip(data.getTip());
        word.setPartOfSpeech(data.getPartOfSpeech());
        word.setLevel(data.getLevel());
        word.setTopic(data.getTopic());
        word.setIpa(data.getIpa());
        word.setAudioUrl(data.getAudioUrl());
        Word savedWord = wordService.saveWord(word);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedWord);
    }

    // POST /api/words/generate-batch
    @PostMapping("/generate-batch")
    public ResponseEntity<List<PostcardData>> generatePostcards(@RequestBody List<String> words) {
        if (words == null || words.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<PostcardData> postcards = aiPostcardService.generatePostcards(words);
        return ResponseEntity.ok(postcards);
    }

    // POST /api/word/{id}/generate
    @PostMapping("/{id}/generate")
    public ResponseEntity<Word> regeneratePostcard(@PathVariable Long id) {
        Word word = wordService.getWordById(id);

        PostcardData data = aiPostcardService.generatePostcard(word.getVocabulary());
        word.setMeaning(data.getMeaning());
        word.setExample(data.getExample());
        word.setTip(data.getTip());

        Word updated = wordService.saveWord(word);
        return ResponseEntity.ok(updated);
    }

    // PUT /api/words/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Word> updateWord(@PathVariable Long id, @RequestBody Word updatedWord) {
        Word word = wordService.updateWord(id, updatedWord);
        return ResponseEntity.ok(word);
    }

    // PATCH /api/words/learned/{id}
    @PatchMapping("/learned/{id}")
    public ResponseEntity<Word> toggleLearned(@PathVariable Long id) {
        Word word = wordService.toggleLearned(id);
        if (word == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(word);
    }

    // DELETE /api/words/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWord(@PathVariable Long id) {
        Word word = wordService.getWordById(id);
        if (word == null) {
            return ResponseEntity.notFound().build();
        }
        wordService.deleteWord(id);
        return ResponseEntity.noContent().build();
    }
}
