package com.example.toeic.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.toeic.model.Word;
import com.example.toeic.service.WordService;

@Controller
@RequestMapping("/words")
public class WordController {
    private final WordService wordService;

    public WordController(WordService wordService) {
        this.wordService = wordService;
    }

    @GetMapping
    public String listWords(Model model){
        model.addAttribute("words", wordService.getAllWords());
        return "word-list";
    }

    @GetMapping("/add")
    public String showAddForm(Model model){
        model.addAttribute("word", new Word());
        return "word-add";
    }

    @PostMapping("/add")
    public String addWord(@ModelAttribute Word word){
        wordService.saveWord(word);
        return "redirect:/words";
    }

    @GetMapping("/delete/{id}")
    public String deleteWord(@PathVariable Long id){
        wordService.deleteWord(id);
        return "redirect:/words";
    }
}
