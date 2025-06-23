package com.example.toeic.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.toeic.dto.PostcardData;
import com.example.toeic.service.AIPostcartService;
import com.example.toeic.service.PronunciationService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AIPostcardServiceImpl implements AIPostcartService {

    private final WebClient webClient;
    private final String model;
    private final PronunciationService pronunciationService;

    @Autowired
    public AIPostcardServiceImpl(
            @Value("${openrouter.api.key}") String apiKey,
            @Value("${openrouter.api.model}") String model,
            PronunciationService pronunciationService) {

        this.webClient = WebClient.builder()
                .baseUrl("https://openrouter.ai/api/v1")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        this.model = model;
        this.pronunciationService = pronunciationService;
    }

    @Override
    public PostcardData generatePostcard(String word) {
        try {
            String aiContent = fetchAIContent(word);
            PostcardData data = parseAIContent(aiContent);
            enrichWithPronunciation(data, word);
            return data;
        } catch (Exception e) {
            log.error("Lỗi khi tạo postcard cho từ '{}': {}", word, e.getMessage(), e);
            return fallbackPostcard();
        }
    }

    private String fetchAIContent(String word) {
        String prompt = buildPrompt(word);
        Map<String, Object> requestBody = buildRequestBody(prompt);

        Map<?, ?> response = webClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return extractContent(response);
    }

    private String buildPrompt(String word) {
        return String.format(
                "You are an English vocabulary teacher. For the word '%s',Correct the spelling of the word, if it is already correct, return the same word. Then provide the following information in exactly one line:\n"
                        + "1. A simple English definition (do NOT write \"meaning\", just the definition),\n"
                        + "2. A short example sentence using the word,\n"
                        + "3. A short tip that helps remember the word meaning through real-life usage, memory tricks, or word parts,\n"
                        + "4. The part of speech (noun, verb, adjective, etc.),\n"
                        + "5. A TOEIC-relevant topic (e.g., Business, Office, Communication),\n"
                        + "6. A difficulty level (easy, medium, hard).\n\n"
                        + "Return your response in this exact format and order:\n"
                        + "[definition] | [example sentence] | [tip] | [part of speech] | [topic] | [level]\n\n"
                        + "Do not add labels, line breaks, quotation marks, or any prefix",
                word);
    }

    private Map<String, Object> buildRequestBody(String prompt) {
        return Map.of(
                "model", model,
                "messages", List.of(Map.of("role", "user", "content", prompt)),
                "temperature", 0.7
        );
    }

    private PostcardData parseAIContent(String content) {
        String[] parts = content.split("\\|");
        return new PostcardData(
                getPart(parts, 0),
                getPart(parts, 1),
                getPart(parts, 2),
                getPart(parts, 3),
                getPart(parts, 4),
                getPart(parts, 5)
        );
    }

    private void enrichWithPronunciation(PostcardData data, String word) {
        String[] pronunciation = pronunciationService.getIpaAndAudio(word);
        data.setIpa(pronunciation[0]);
        data.setAudioUrl(pronunciation[1]);
    }

    private String getPart(String[] parts, int index) {
        return (parts.length > index && parts[index] != null) ? parts[index].trim() : "";
    }

    private PostcardData fallbackPostcard() {
        return new PostcardData(
                "No meaning", "No example", "No tip",
                "No part of speech", "No topic", "No level",
                "No ipa", "No audio");
    }

    private String extractContent(Map<?, ?> response) {
        try {
            List<?> choices = (List<?>) response.get("choices");
            if (choices == null || choices.isEmpty()) return "";

            Map<?, ?> choice = (Map<?, ?>) choices.get(0);
            Map<?, ?> message = (Map<?, ?>) choice.get("message");
            return message.get("content").toString();
        } catch (Exception e) {
            log.warn("Không thể trích xuất content từ response: {}", e.getMessage());
            return "";
        }
    }
}
