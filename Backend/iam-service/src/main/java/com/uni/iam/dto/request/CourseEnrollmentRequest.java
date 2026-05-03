package com.uni.iam.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO LAYER — Inbound
 * Payload to enroll a user in a course.
 * Both fields are required; the course-service validates that the course exists.
 */
@Data
public class CourseEnrollmentRequest {

    @NotNull(message = "userId is required")
    private Long userId;

    @NotNull(message = "courseId is required")
    private Long courseId;
}
