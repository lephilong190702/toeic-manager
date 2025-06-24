package com.example.toeic.service;

import java.util.List;

import com.example.toeic.dto.PostcardData;
import com.example.toeic.model.Word;

public interface AIPostcartService {
    PostcardData generatePostcard(String word);
    PostcardData regeneratePostcard(Long id);
    List<PostcardData> generatePostcards(List<String> words);
}
