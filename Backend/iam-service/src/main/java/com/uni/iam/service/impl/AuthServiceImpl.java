package com.uni.iam.service.impl;

import com.uni.iam.dto.request.LoginRequest;
import com.uni.iam.dto.request.RegisterRequest;
import com.uni.iam.dto.response.AuthResponse;
import com.uni.iam.entity.Role;
import com.uni.iam.entity.Student;
import com.uni.iam.entity.Teacher;
import com.uni.iam.entity.User;
import com.uni.iam.exception.InvalidTeacherCodeException;
import com.uni.iam.exception.UserAlreadyExistsException;
import com.uni.iam.repository.UserRepository;
import com.uni.iam.security.JwtUtils;
import com.uni.iam.service.interfaces.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final String TEACHER_CODE = "teacher123";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered: " + request.getEmail());
        }

        User user = buildUser(request);
        userRepository.save(user);
        log.info("Registered new user: {} with role: {}", user.getUsername(), user.getRole());

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim(), request.getPassword())
        );

        String token = jwtUtils.generateToken(auth);
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim();
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        String token = jwtUtils.generateToken(auth);
        log.info("User logged in: {}", user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .build();
    }

    private User buildUser(RegisterRequest req) {
        String hashed = passwordEncoder.encode(req.getPassword());
        String teacherCode = req.getTeacherCode() == null ? null : req.getTeacherCode().trim();

        if (teacherCode == null || teacherCode.isEmpty()) {
            Student student = new Student();
            student.setUsername(req.getUsername());
            student.setEmail(req.getEmail());
            student.setPassword(hashed);
            student.setRole(Role.STUDENT);
            return student;
        }

        if (!TEACHER_CODE.equals(teacherCode)) {
            throw new InvalidTeacherCodeException();
        }

        Teacher teacher = new Teacher();
        teacher.setUsername(req.getUsername());
        teacher.setEmail(req.getEmail());
        teacher.setPassword(hashed);
        teacher.setRole(Role.TEACHER);
        return teacher;
    }
}
