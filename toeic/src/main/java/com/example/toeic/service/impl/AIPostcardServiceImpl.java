package com.example.toeic.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.toeic.dto.PostcardData;
import com.example.toeic.service.AIPostcartService;

import lombok.extern.slf4j.Slf4j;


@Service
@Slf4j
public class AIPostcardServiceImpl implements AIPostcartService{
    private final WebClient webClient;

    public AIPostcardServiceImpl(
            @Value("${openrouter.api.key}") String apiKey,
            @Value("${openrouter.api.model}") String model) {

        this.webClient = WebClient.builder()
                .baseUrl("https://openrouter.ai/api/v1")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        this.model = model;
    }

    private final String model;

    @Override
    public PostcardData generatePostcard(String word) {
        String prompt = String.format(
                "You are an English vocabulary teacher. For the word '%s',Correct the spelling of the word, if it is already correct, return the same word. Then provide the following information in exactly one line:\n"
                        + "1. A simple English definition (do NOT write \"meaning\", just the definition),\n"
                        + "2. A short example sentence using the word,\n"
                        + "3. A short tip that helps remember the word meaning through real-life usage, memory tricks, or word parts,\n"
                        + "4. The part of speech (noun, verb, adjective, etc.),\n"
                        + "5. A topic (food, business, emotion, etc.),\n"
                        + "6. A difficulty level (easy, medium, hard).\n\n"
                        + "Return your response in this exact format and order:\n"
                        + "[definition] | [example sentence] | [tip] | [part of speech] | [topic] | [level]\n\n"
                        + "Do not add labels, line breaks, quotation marks, or any prefix",
                word);

        Map<String, Object> message = Map.of(
                "role", "user",
                "content", prompt);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", List.of(message));
        requestBody.put("temperature", 0.7); // optional

        try {
            Map<?, ?> response = webClient.post()
                    .uri("/chat/completions")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            String content = extractContent(response);

            // Parse kết quả: "meaning | example | tip"
            String[] parts = content.split("\\|");
            return new PostcardData(
                    parts.length > 0 ? parts[0].trim() : "No meaning",
                    parts.length > 1 ? parts[1].trim() : "No example",
                    parts.length > 2 ? parts[2].trim() : "No tip",
                    parts.length > 3 ? parts[3].trim() : "No part of speech",
                    parts.length > 4 ? parts[4].trim() : "No topic",
                    parts.length > 5 ? parts[5].trim() : "No level");

        } catch (Exception e) {
            log.error("Lỗi khi gọi AI: {}", e.getMessage(), e);
            return new PostcardData("No meaning", "No example", "No tip", "No part of speech", "No level", "No topic");
        }
    }

    private String extractContent(Map<?, ?> response) {
        List<?> choices = (List<?>) response.get("choices");
        if (choices == null || choices.isEmpty())
            return "No content";
        Map<?, ?> choice = (Map<?, ?>) choices.get(0);
        Map<?, ?> message = (Map<?, ?>) choice.get("message");
        return message.get("content").toString();
    }
}
