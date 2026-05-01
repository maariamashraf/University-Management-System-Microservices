package com.uni.iam.repository;

import com.uni.iam.entity.Role;
import com.uni.iam.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * REPOSITORY LAYER
 * Spring Data JPA repository for User (and its subtypes).
 * Extended with role-based, bulk-ID, and course-membership queries.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    /** All users with a specific role (STUDENT | TEACHER | ADMIN). */
    List<User> findAllByRole(Role role);

    /**
     * Fetch multiple users by a list of IDs in a single query.
     * Used after resolving user IDs from the enrollment table.
     */
    List<User> findByIdIn(List<Long> ids);

    /**
     * Fetch all users enrolled in a given course.
     * Joins through CourseEnrollment so we avoid loading all enrollments first.
     */
    @Query("SELECT u FROM User u JOIN CourseEnrollment ce ON ce.user.id = u.id WHERE ce.courseId = :courseId")
    List<User> findAllByCourseId(@Param("courseId") Long courseId);
}
