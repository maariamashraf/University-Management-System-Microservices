package com.uni.iam.repository;

import com.uni.iam.entity.CourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * REPOSITORY LAYER
 * Spring Data JPA repository for CourseEnrollment.
 * Used to query which users are in a given course
 * and which courses a given user belongs to.
 */
@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {

    /** All enrollments for a specific user. */
    List<CourseEnrollment> findByUserId(Long userId);

    /** All enrollments for a specific course (all user types). */
    List<CourseEnrollment> findByCourseId(Long courseId);

    /** Check if a user is already enrolled in a course. */
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    /** Remove a specific enrollment by user + course. */
    void deleteByUserIdAndCourseId(Long userId, Long courseId);

    /**
     * Returns all course IDs that a given user is enrolled in.
     * Used to show a user's full course list.
     */
    @Query("SELECT ce.courseId FROM CourseEnrollment ce WHERE ce.user.id = :userId")
    List<Long> findCourseIdsByUserId(@Param("userId") Long userId);

    /**
     * Returns all user IDs enrolled in a given course.
     * Used by the course-users lookup endpoint.
     */
    @Query("SELECT ce.user.id FROM CourseEnrollment ce WHERE ce.courseId = :courseId")
    List<Long> findUserIdsByCourseId(@Param("courseId") Long courseId);
}
