package com.uni.iam.service;

import com.uni.iam.dto.request.UpdateUserRequest;
import com.uni.iam.dto.response.StudentResponse;
import com.uni.iam.dto.response.TeacherResponse;
import com.uni.iam.dto.response.UserResponse;
import com.uni.iam.entity.Role;

import java.util.List;

/**
 * SERVICE LAYER — Interface
 * Defines all user-management operations.
 * Implementations are decoupled from the HTTP layer.
 *
 * Covered operations:
 *   - Get user(s) by ID, role, course
 *   - List all students / teachers
 *   - Update and delete users
 */
public interface UserService {

    // ── Read operations ──────────────────────────────────────────────────────

    /** Fetch a single user by primary key. Throws UserNotFoundException if absent. */
    UserResponse getUserById(Long id);

    /** Fetch a single user by username. Throws UserNotFoundException if absent. */
    UserResponse getUserByUsername(String username);

    /** Fetch all users regardless of type. */
    List<UserResponse> getAllUsers();

    /** Fetch all users with a specific role. */
    List<UserResponse> getUsersByRole(Role role);

    /** Fetch all students with full student-specific fields. */
    List<StudentResponse> getAllStudents();

    /** Fetch students filtered by department ID. */
    List<StudentResponse> getStudentsByDepId(Long depId);

    /** Fetch students filtered by year of study. */
    List<StudentResponse> getStudentsByYear(Integer year);

    /** Fetch all teachers with full teacher-specific fields. */
    List<TeacherResponse> getAllTeachers();



    // ── Write operations ─────────────────────────────────────────────────────

    /**
     * Partially update a user's profile.
     * Only non-null fields in the request are applied.
     * Role changes are not allowed through this method.
     */
    UserResponse updateUser(Long id, UpdateUserRequest request);

    /** Permanently delete a user and their sub-type record. */
    void deleteUser(Long id);
}
