package com.uni.iam.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO LAYER — Outbound
 * Returns all users (of any type) that are enrolled/assigned to a given course.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseUsersResponse {

    private Long courseId;

    /** Mixed list of students, teachers, and admins in this course. */
    private List<UserResponse> users;

    private int totalCount;
}
