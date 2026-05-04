package com.uni.iam.service.interfaces;

import com.uni.iam.dto.request.UpdateUserRequest;
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
