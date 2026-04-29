package com.unisystem.academic_core_service.domain.events;

import java.time.LocalDate;

public record CourseCreatedEvent(
        String courseId,
        String courseName,
        String departmentName,
        LocalDate createdAt
) {
}
