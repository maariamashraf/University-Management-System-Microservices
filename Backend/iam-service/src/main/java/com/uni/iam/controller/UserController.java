package com.uni.iam.controller;

import com.uni.iam.dto.request.UpdateUserRequest;
import com.uni.iam.dto.response.StudentResponse;
import com.uni.iam.dto.response.TeacherResponse;
import com.uni.iam.dto.response.UserResponse;
import com.uni.iam.entity.Role;
import com.uni.iam.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CONTROLLER (PRESENTATION) LAYER
 * REST API for all user-management operations.
 *
 * Base path: /api/users
 *
 * Role conventions enforced via @PreAuthorize:
 *   ROLE_ADMIN   — full access
 *   ROLE_TEACHER — read students
 *   ROLE_STUDENT — read/update own profile only
 *
 * NO business logic lives here — only HTTP concerns.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ════════════════════════════════════════════════════════════
    // GET  /api/users/{id}
    // Returns any user by primary key.
    // ADMIN sees all; others may only see their own (enforced downstream).
    // ════════════════════════════════════════════════════════════
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.username")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // ════════════════════════════════════════════════════════════
    // GET  /api/users
    // Returns all users (any type/role). Admin-only.
    // ════════════════════════════════════════════════════════════
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ════════════════════════════════════════════════════════════
    // GET  /api/users/role/{role}
    // Returns all users with the given role.
    // ════════════════════════════════════════════════════════════
    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@PathVariable Role role) {
        return ResponseEntity.ok(userService.getUsersByRole(role));
    }

    // ════════════════════════════════════════════════════════════
    // GET  /api/users/students
    // All students with student-specific fields.
    // ════════════════════════════════════════════════════════════
    @GetMapping("/students")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<StudentResponse>> getAllStudents() {
        return ResponseEntity.ok(userService.getAllStudents());
    }

    // ════════════════════════════════════════════════════════════
    // GET  /api/users/students/department/{depId}
    // Filter students by department ID.
    // ════════════════════════════════════════════════════════════
    @GetMapping("/students/department/{depId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<StudentResponse>> getStudentsByDepId(
            @PathVariable Long depId) {
        return ResponseEntity.ok(userService.getStudentsByDepId(depId));
    }

    // ════════════════════════════════════════════════════════════
    // GET  /api/users/students/year/{year}
    // Filter students by year of study.
    // ════════════════════════════════════════════════════════════
    @GetMapping("/students/year/{year}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<StudentResponse>> getStudentsByYear(@PathVariable Integer year) {
        return ResponseEntity.ok(userService.getStudentsByYear(year));
    }

    // ════════════════════════════════════════════════════════════
    // GET  /api/users/teachers
    // All teachers with teacher-specific fields. Admin-only.
    // ════════════════════════════════════════════════════════════
    @GetMapping("/teachers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TeacherResponse>> getAllTeachers() {
        return ResponseEntity.ok(userService.getAllTeachers());
    }



    // ════════════════════════════════════════════════════════════
    // PUT  /api/users/{id}
    // Partial update — only non-null fields are changed.
    // ADMIN can update anyone; users can update themselves.
    // ════════════════════════════════════════════════════════════
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.username")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    // ════════════════════════════════════════════════════════════
    // DELETE  /api/users/{id}
    // Permanently deletes a user. Admin-only.
    // ════════════════════════════════════════════════════════════
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }


}
