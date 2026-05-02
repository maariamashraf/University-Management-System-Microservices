package com.uni.iam.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * ENTITY LAYER
 * Represents a user's enrollment in a course.
 * Persisted in the course_enrollments table.
 *
 * course_id is a logical reference to the course-service —
 * no DB-level FK since courses live in a different microservice.
 */
@Entity
@Table(
    name = "course_enrollments",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_user_course",
        columnNames = {"user_id", "course_id"}
    )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The user (student or teacher) enrolled/assigned to the course.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Logical reference to the course in the course-service.
     * Not a DB FK — cross-microservice boundary.
     */
    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "enrolled_at", updatable = false)
    private LocalDateTime enrolledAt;

    @PrePersist
    protected void onCreate() {
        enrolledAt = LocalDateTime.now();
    }
}
