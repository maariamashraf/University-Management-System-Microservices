package com.uni.iam.service;

import com.uni.iam.dto.request.UpdateUserRequest;
import com.uni.iam.dto.response.StudentResponse;
import com.uni.iam.dto.response.TeacherResponse;
import com.uni.iam.dto.response.UserResponse;
import com.uni.iam.entity.*;
import com.uni.iam.exception.UserNotFoundException;
import com.uni.iam.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * SERVICE LAYER — Implementation
 * All business logic for user management.
 *
 * Cross-cutting concerns (logging, timing) are handled by LoggingAspect via AOP.
 * This class stays focused purely on business rules.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository             userRepository;
    private final StudentRepository          studentRepository;
    private final TeacherRepository          teacherRepository;

    // ═══════════════════════════════════════════════════════════
    // READ OPERATIONS
    // ═══════════════════════════════════════════════════════════

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = findUserOrThrow(id);
        return toUserResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return toUserResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toUserResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByRole(Role role) {
        return userRepository.findAllByRole(role)
                .stream()
                .map(this::toUserResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::toStudentResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> getStudentsByDepId(Long depId) {
        return studentRepository.findByDepId(depId)
                .stream()
                .map(this::toStudentResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> getStudentsByYear(Integer year) {
        return studentRepository.findByYearOfStudy(year)
                .stream()
                .map(this::toStudentResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherResponse> getAllTeachers() {
        return teacherRepository.findAll()
                .stream()
                .map(this::toTeacherResponse)
                .toList();
    }



    // ═══════════════════════════════════════════════════════════
    // WRITE OPERATIONS
    // ═══════════════════════════════════════════════════════════

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = findUserOrThrow(id);

        // Apply generic User fields only if provided
        if (request.getUsername() != null) user.setUsername(request.getUsername());
        if (request.getEmail()    != null) user.setEmail(request.getEmail());

        // Apply Student-specific fields
        if (user instanceof Student student) {
            if (request.getDepId()  != null) student.setDepId(request.getDepId());
            if (request.getYearOfStudy() != null) student.setYearOfStudy(request.getYearOfStudy());
        }

        // Apply Teacher-specific fields
        if (user instanceof Teacher teacher) {
            if (request.getOfficeNumber()  != null) teacher.setOfficeNumber(request.getOfficeNumber());
            if (request.getSpecialization()!= null) teacher.setSpecialization(request.getSpecialization());
        }

        User saved = userRepository.save(user);
        return toUserResponse(saved);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }
        userRepository.deleteById(id);
    }



    // ═══════════════════════════════════════════════════════════
    // PRIVATE HELPERS
    // ═══════════════════════════════════════════════════════════

    private User findUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    private StudentResponse toStudentResponse(Student s) {
        return StudentResponse.builder()
                .id(s.getId())
                .username(s.getUsername())
                .email(s.getEmail())
                .role(s.getRole())
                .createdAt(s.getCreatedAt())
                .studentNumber(s.getStudentNumber())
                .depId(s.getDepId())
                .yearOfStudy(s.getYearOfStudy())
                .build();
    }

    private TeacherResponse toTeacherResponse(Teacher t) {
        return TeacherResponse.builder()
                .id(t.getId())
                .username(t.getUsername())
                .email(t.getEmail())
                .role(t.getRole())
                .createdAt(t.getCreatedAt())
                .officeNumber(t.getOfficeNumber())
                .specialization(t.getSpecialization())
                .build();
    }
}
