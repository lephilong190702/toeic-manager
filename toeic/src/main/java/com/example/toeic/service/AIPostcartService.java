package com.example.toeic.service;

import java.util.List;

import com.example.toeic.dto.PostcardData;

public interface AIPostcartService {
    PostcardData generatePostcard(String word);
    List<PostcardData> generatePostcards(List<String> words);
}
