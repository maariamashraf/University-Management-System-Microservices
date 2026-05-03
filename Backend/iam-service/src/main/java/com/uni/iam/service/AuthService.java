package com.uni.iam.service;

import com.uni.iam.dto.request.LoginRequest;
import com.uni.iam.dto.request.RegisterRequest;
import com.uni.iam.dto.response.AuthResponse;
import com.uni.iam.entity.*;
import com.uni.iam.exception.UserAlreadyExistsException;
import com.uni.iam.repository.UserRepository;
import com.uni.iam.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * SERVICE LAYER
 * Core business logic for the IAM service.
 *
 * Responsibilities:
 *   1. register()  — validate uniqueness, hash password, persist user, return JWT
 *   2. login()     — authenticate via Spring Security, return JWT
 *
 * This layer knows nothing about HTTP; it works with plain DTOs.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository    userRepository;
    private final PasswordEncoder   passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils          jwtUtils;

    // ─────────────────────────────────────────────
    // Register
    // ─────────────────────────────────────────────

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Uniqueness checks
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered: " + request.getEmail());
        }

        // Build the correct subtype based on role
        User user = buildUser(request);
        userRepository.save(user);
        log.info("Registered new user: {} with role: {}", user.getUsername(), user.getRole());

        // Immediately authenticate so we can issue a token
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        String token = jwtUtils.generateToken(auth);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .build();
    }

    // ─────────────────────────────────────────────
    // Login
    // ─────────────────────────────────────────────

    public AuthResponse login(LoginRequest request) {
        // Throws BadCredentialsException if wrong credentials
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found after authentication — should never happen"));

        String token = jwtUtils.generateToken(auth);
        log.info("User logged in: {}", user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .build();
    }

    // ─────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────

    private User buildUser(RegisterRequest req) {
    String hashed = passwordEncoder.encode(req.getPassword());

    return switch (req.getRole()) {
        case STUDENT -> {
            Student s = new Student();
            s.setUsername(req.getUsername());
            s.setEmail(req.getEmail());
            s.setPassword(hashed);
            s.setRole(Role.STUDENT);
            s.setStudentNumber(req.getStudentNumber());
            s.setDepId(req.getDepId());
            s.setYearOfStudy(req.getYearOfStudy());
            yield s;
        }
        case TEACHER -> {
            Teacher t = new Teacher();
            t.setUsername(req.getUsername());
            t.setEmail(req.getEmail());
            t.setPassword(hashed);
            t.setRole(Role.TEACHER);
            t.setOfficeNumber(req.getOfficeNumber());
            t.setSpecialization(req.getSpecialization());
            yield t;
        }
        case ADMIN -> {
            Admin admin = new Admin();
            admin.setUsername(req.getUsername());
            admin.setEmail(req.getEmail());
            admin.setPassword(hashed);
            admin.setRole(Role.ADMIN);
            yield admin;
        }
    };
}
}