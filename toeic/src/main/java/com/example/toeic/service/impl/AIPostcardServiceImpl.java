package com.example.toeic.service.impl;

import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.toeic.dto.PostcardData;
import com.example.toeic.model.Topic;
import com.example.toeic.model.User;
import com.example.toeic.model.Word;
import com.example.toeic.repository.WordRepository;
import com.example.toeic.service.AIPostcartService;
import com.example.toeic.service.AuthService;
import com.example.toeic.service.PronunciationService;
import com.example.toeic.service.TopicService;

import lombok.extern.slf4j.Slf4j;
import reactor.netty.http.client.HttpClient;

@Service
@Slf4j
public class AIPostcardServiceImpl implements AIPostcartService {

    private final WebClient webClient;
    private final String model;
    private final PronunciationService pronunciationService;
    private final WordRepository wordRepository;
    private final TopicService topicService;

    @Autowired
    private AuthService authService;

    @Autowired
    public AIPostcardServiceImpl(
            @Value("${openrouter.api.key}") String apiKey,
            @Value("${openrouter.api.model}") String model,
            PronunciationService pronunciationService,
            WordRepository wordRepository,
            TopicService topicService) {

        this.webClient = WebClient.builder()
                .baseUrl("https://openrouter.ai/api/v1")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .clientConnector(new ReactorClientHttpConnector(
                        HttpClient.create().responseTimeout(Duration.ofSeconds(15))))
                .build();

        this.model = model;
        this.pronunciationService = pronunciationService;
        this.wordRepository = wordRepository;
        this.topicService = topicService;
    }

    @Override
    public PostcardData generatePostcard(String rawInput) {
        try {
            String word = rawInput.trim().toLowerCase();

            Optional<Word> existing = wordRepository.findByVocabularyIgnoreCase(word);
            if (existing.isPresent()) {
                return convertToPostcardData(existing.get());
            }

            String aiContent = fetchAIContent(word);
            PostcardData data = parseAIContent(aiContent);
            enrichWithPronunciation(data, word);

            Word newWord = mapToWordEntity(word, data);
            User user = authService.getCurrentUser();
            newWord.setUser(user);
            wordRepository.save(newWord);
            data.setId(newWord.getId());

            return data;
        } catch (Exception e) {
            log.error("Error generating postcard for '{}': {}", rawInput, e.getMessage(), e);
            return errorPostcard(rawInput, e.getMessage());
        }
    }

    @Override
    public PostcardData regeneratePostcard(Long id) {
        try {
            Word word = wordRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Word not found with ID: " + id));

            String vocabulary = word.getVocabulary();

            String aiContent = fetchAIContent(vocabulary);
            PostcardData data = parseAIContent(aiContent);
            enrichWithPronunciation(data, vocabulary);

            updateWordEntity(word, data);
            wordRepository.save(word);

            data.setId(word.getId());
            data.setVocabulary(vocabulary);
            return data;
        } catch (Exception e) {
            log.error("❌ Error regenerating postcard: {}", e.getMessage(), e);
            return errorPostcard(null, e.getMessage());
        }
    }

    @Override
    public List<PostcardData> generatePostcards(List<String> words) {
        return words.stream()
                .map(word -> {
                    PostcardData data = generatePostcard(word);
                    if (data.getVocabulary() == null || data.getVocabulary().isBlank()) {
                        data.setVocabulary(word);
                    }
                    return data;
                })
                .collect(Collectors.toList());
    }

    private String fetchAIContent(String word) {
        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(Map.of("role", "user", "content", buildPrompt(word))),
                "temperature", 0.7);

        Map<?, ?> response = webClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return extractContentFromResponse(response);
    }

    private String buildPrompt(String word) {
        return String.format(
                """
                        You are an English vocabulary teacher.

                        For the word '%s', provide exactly the following six fields, separated **by a single pipe symbol `|`**:

                        1. A **simple English definition** of the word (no more than 20 words).
                        2. A short and clear **example sentence** (in real-life context).
                        3. A **memory tip** (fun or visual idea to remember the word).
                        4. The **part of speech** (noun, verb, adjective, etc).
                        5. A **TOEIC-related topic** (choose from: Business, Communication, Daily Life, Directions, Education, Entertainment, Food And Drink, Health, Home, Technology, Travel, Shopping, Office).
                        6. The **difficulty level** (choose only from: Easy, Medium, Hard).

                        Output format (exactly one line):
                        [definition] | [example] | [tip] | [part of speech] | [topic] | [level]

                        Do NOT include labels like "Definition:" or extra punctuation.
                        Do NOT use commas `,` or slashes `/` inside values. Only use the pipe `|` to separate fields.

                        Make sure your response follows the exact format, in the exact order.
                        """,
                word);
    }

    private String extractContentFromResponse(Map<?, ?> response) {
        try {
            List<?> choices = (List<?>) response.get("choices");
            if (choices == null || choices.isEmpty())
                return "";

            Map<?, ?> choice = (Map<?, ?>) choices.get(0);
            Map<?, ?> message = (Map<?, ?>) choice.get("message");
            return message.get("content").toString();
        } catch (Exception e) {
            log.warn("⚠️ Cannot extract AI content: {}", e.getMessage());
            return "";
        }
    }

    private PostcardData parseAIContent(String content) {
        String[] parts = content.split("\\|");
        return new PostcardData(
                safePart(parts, 0),
                safePart(parts, 1),
                safePart(parts, 2),
                safePart(parts, 3),
                safePart(parts, 4),
                safePart(parts, 5));
    }

    private void enrichWithPronunciation(PostcardData data, String word) {
        String[] pronunciation = pronunciationService.getIpaAndAudio(word);
        data.setIpa(pronunciation[0]);
        data.setAudioUrl(pronunciation[1]);
    }

    private Word mapToWordEntity(String word, PostcardData data) {
        Word entity = new Word();
        entity.setVocabulary(word);
        entity.setMeaning(data.getMeaning());
        entity.setExample(data.getExample());
        entity.setTip(data.getTip());
        entity.setPartOfSpeech(data.getPartOfSpeech());
        entity.setTopic(topicService.createTopicIfNotExists(data.getTopic()));
        entity.setLevel(data.getLevel());
        entity.setIpa(data.getIpa());
        entity.setAudioUrl(data.getAudioUrl());
        entity.setLearned(false);
        return entity;
    }

    private void updateWordEntity(Word word, PostcardData data) {
        word.setMeaning(data.getMeaning());
        word.setExample(data.getExample());
        word.setTip(data.getTip());
        word.setPartOfSpeech(data.getPartOfSpeech());
        word.setTopic(topicService.createTopicIfNotExists(data.getTopic()));
        word.setLevel(data.getLevel());
        word.setIpa(data.getIpa());
        word.setAudioUrl(data.getAudioUrl());
    }

    private PostcardData convertToPostcardData(Word word) {
        PostcardData data = new PostcardData();
        data.setId(word.getId());
        data.setVocabulary(word.getVocabulary());
        data.setMeaning(word.getMeaning());
        data.setExample(word.getExample());
        data.setTip(word.getTip());
        data.setPartOfSpeech(word.getPartOfSpeech());
        data.setTopic(Optional.ofNullable(word.getTopic()).map(Topic::getName).orElse(""));
        data.setLevel(Optional.ofNullable(word.getLevel()).orElse("unknown").toLowerCase());
        data.setIpa(word.getIpa());
        data.setAudioUrl(word.getAudioUrl());
        return data;
    }

    private PostcardData errorPostcard(String vocab, String message) {
        PostcardData error = new PostcardData();
        error.setVocabulary(vocab);
        error.setError(true);
        error.setErrorMessage("Failed to process word: " + message);
        return error;
    }

    private String safePart(String[] parts, int index) {
        return (parts.length > index && parts[index] != null) ? parts[index].trim() : "";
    }
}
