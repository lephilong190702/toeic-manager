package com.example.toeic.controller.api;

import java.util.List;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.toeic.dto.PostcardData;
import com.example.toeic.model.User;
import com.example.toeic.model.Word;
import com.example.toeic.service.AIPostcartService;
import com.example.toeic.service.AuthService;
import com.example.toeic.service.WordService;

@RestController
@RequestMapping("/api/words")
@CrossOrigin
public class WordApiController {
    @Autowired
    private WordService wordService;
    @Autowired
    private AuthService authService;
    @Autowired
    private AIPostcartService aiPostcardService;

    // GET /api/words
    @GetMapping
    public ResponseEntity<List<Word>> getAllWords() {
        List<Word> words = wordService.getWordsByUser(authService.getCurrentUser());
        return ResponseEntity.ok(words);
    }

    // GET /api/words/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Word> getWordById(@PathVariable Long id) {
        Word word = wordService.getWordById(id);
        User currentUser = authService.getCurrentUser();
        if (word == null) {
            return ResponseEntity.notFound().build();
        }
        if (!word.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(word);
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

    @PutMapping("/{id}/regenerate")
    public ResponseEntity<PostcardData> regeneratePostcard(@PathVariable Long id) {
        Word word = wordService.getWordById(id);
        User currentUser = authService.getCurrentUser();
        if (word == null || !word.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        PostcardData regenerated = aiPostcardService.regeneratePostcard(id);
        return ResponseEntity.ok(regenerated);
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


    @GetMapping("/unlearned")
    public ResponseEntity<List<PostcardData>> getUnlearnedWords() {
        User user = authService.getCurrentUser();
        List<PostcardData> words = wordService.getUnlearnedPostcardsForUser(user);
        if (words.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content
        }
        return ResponseEntity.ok(words);
    }

    @GetMapping("/learned-by-topic")
    public ResponseEntity<List<PostcardData>> getLearnedWordsByTopic(@RequestParam(required = false) String topic) {
        User user = authService.getCurrentUser();
        List<PostcardData> words = wordService.getLearnedPostcardsByUserAndTopic(user, topic);
        if (words.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(words);
    }

}
