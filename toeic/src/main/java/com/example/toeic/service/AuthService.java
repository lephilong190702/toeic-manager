package com.example.toeic.service;

import com.example.toeic.dto.AuthenticationRequest;
import com.example.toeic.dto.AuthenticationResponse;
import com.example.toeic.dto.RegisterRequest;
import com.example.toeic.model.User;

public interface AuthService {
    AuthenticationResponse authenticate(AuthenticationRequest request);
    AuthenticationResponse register(RegisterRequest request);
    User getCurrentUser();
    Long getCurrentUserId();
}
