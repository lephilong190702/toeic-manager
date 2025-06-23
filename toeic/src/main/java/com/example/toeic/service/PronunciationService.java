package com.example.toeic.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class PronunciationService {
    private final WebClient webClient = WebClient.create();

    public String[] getIpaAndAudio(String vocabulary) {
        try {
            if (vocabulary == null || vocabulary.trim().isEmpty()) {
                System.out.println("⚠️ Vocabulary is null or empty");
                return new String[] { "", "" };
            }

            String url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + vocabulary.trim();
            System.out.println("🌐 Calling: " + url);

            List<Map<String, Object>> response = WebClient.create()
                    .get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(List.class)
                    .block();

            if (response == null || response.isEmpty()) {
                System.out.println("❌ No response or empty list");
                return new String[] { "", "" };
            }

            Map<String, Object> entry = response.get(0);

            // ✅ Lấy phiên âm chính
            String ipa = entry.containsKey("phonetic") ? (String) entry.get("phonetic") : "";
            System.out.println("📌 IPA: " + ipa);

            // ✅ Lấy audio nếu có
            List<Map<String, Object>> phonetics = (List<Map<String, Object>>) entry.get("phonetics");

            String audioUrl = phonetics.stream()
                    .map(p -> (String) p.get("audio"))
                    .filter(a -> a != null && !a.isEmpty())
                    .findFirst()
                    .orElse("");

            System.out.println("🔊 Audio URL: " + audioUrl);

            return new String[] { ipa, audioUrl };

        } catch (Exception e) {
            System.err.println("❌ Error fetching pronunciation: " + e.getMessage());
            return new String[] { "", "" };
        }
    }

}
