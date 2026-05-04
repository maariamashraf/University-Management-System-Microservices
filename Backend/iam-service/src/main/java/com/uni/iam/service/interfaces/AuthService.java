package com.uni.iam.service.interfaces;

import com.uni.iam.dto.request.LoginRequest;
import com.uni.iam.dto.request.RegisterRequest;
import com.uni.iam.dto.response.AuthResponse;
public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refresh(String token);
}