package com.uni.iam.controller;

import com.uni.iam.dto.request.LoginRequest;
import com.uni.iam.dto.request.RegisterRequest;
import com.uni.iam.dto.response.AuthResponse;
import com.uni.iam.service.interfaces.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * CONTROLLER (PRESENTATION) LAYER
 * Exposes the IAM REST API.
 *
 * Endpoints:
 *   POST /api/auth/register  → register a new user, returns JWT
 *   POST /api/auth/login     → authenticate with email + password, returns JWT
 *
 * This layer only:
 *   • Receives HTTP requests
 *   • Validates input (@Valid)
 *   • Delegates to the service layer
 *   • Maps responses to HTTP status codes
 *
 * NO business logic lives here.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Register a new user (Student, Teacher)
     * Returns 201 Created + JWT on success.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
