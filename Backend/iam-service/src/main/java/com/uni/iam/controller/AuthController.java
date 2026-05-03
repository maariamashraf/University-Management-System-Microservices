package com.uni.iam.controller;

import com.uni.iam.dto.request.LoginRequest;
import com.uni.iam.dto.request.RegisterRequest;
import com.uni.iam.dto.response.AuthResponse;
import com.uni.iam.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * CONTROLLER (PRESENTATION) LAYER
 * Exposes the IAM REST API.
 *
 * Endpoints:
 *   POST /api/auth/register  → register a new user, returns JWT
 *   POST /api/auth/login     → authenticate, returns JWT
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
     * Register a new user (Student, Teacher, or Admin).
     * Returns 201 Created + JWT on success.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            Authentication authentication
    ) {
        String currentRole = null;
        if (authentication != null && authentication.getAuthorities() != null) {
            currentRole = authentication.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .findFirst()
                    .orElse(null);
        }
        
        AuthResponse response = authService.register(request, currentRole);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Authenticate an existing user.
     * Returns 200 OK + JWT on success.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Refresh an existing, valid JWT.
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        String token = authHeader.substring(7);
        AuthResponse response = authService.refresh(token);
        return ResponseEntity.ok(response);
    }
}
