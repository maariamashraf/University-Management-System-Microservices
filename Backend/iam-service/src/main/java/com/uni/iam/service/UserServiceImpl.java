package com.uni.iam.service;

import com.uni.iam.dto.request.CourseEnrollmentRequest;
import com.uni.iam.dto.request.UpdateUserRequest;
import com.uni.iam.dto.response.CourseUsersResponse;
import com.uni.iam.dto.response.StudentResponse;
import com.uni.iam.dto.response.TeacherResponse;
import com.uni.iam.dto.response.UserResponse;
import com.uni.iam.entity.*;
import com.uni.iam.exception.AlreadyEnrolledException;
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
    private final CourseEnrollmentRepository enrollmentRepository;

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
    public List<StudentResponse> getStudentsByDepartment(String department) {
        return studentRepository.findByDepartment(department)
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

    @Override
    @Transactional(readOnly = true)
    public List<TeacherResponse> getTeachersByFaculty(String faculty) {
        return teacherRepository.findByFaculty(faculty)
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
            if (request.getDepartment()  != null) student.setDepartment(request.getDepartment());
            if (request.getYearOfStudy() != null) student.setYearOfStudy(request.getYearOfStudy());
        }

        // Apply Teacher-specific fields
        if (user instanceof Teacher teacher) {
            if (request.getFaculty()       != null) teacher.setFaculty(request.getFaculty());
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
    // COURSE ENROLLMENT OPERATIONS
    // ═══════════════════════════════════════════════════════════

    @Override
    @Transactional
    public void enrollUserInCourse(CourseEnrollmentRequest request) {
        Long userId   = request.getUserId();
        Long courseId = request.getCourseId();

        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new AlreadyEnrolledException(userId, courseId);
        }

        User user = findUserOrThrow(userId);

        CourseEnrollment enrollment = CourseEnrollment.builder()
                .user(user)
                .courseId(courseId)
                .build();

        enrollmentRepository.save(enrollment);
    }

    @Override
    @Transactional
    public void removeUserFromCourse(Long userId, Long courseId) {
        // Ensure user exists before attempting removal
        findUserOrThrow(userId);
        enrollmentRepository.deleteByUserIdAndCourseId(userId, courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseUsersResponse getUsersByCourse(Long courseId) {
        List<User> users = userRepository.findAllByCourseId(courseId);
        List<UserResponse> responses = users.stream()
                .map(this::toUserResponse)
                .toList();

        return CourseUsersResponse.builder()
                .courseId(courseId)
                .users(responses)
                .totalCount(responses.size())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Long> getUserCourses(Long userId) {
        findUserOrThrow(userId);  // validate the user exists
        return enrollmentRepository.findCourseIdsByUserId(userId);
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
                .department(s.getDepartment())
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
                .faculty(t.getFaculty())
                .officeNumber(t.getOfficeNumber())
                .specialization(t.getSpecialization())
                .build();
    }
}
