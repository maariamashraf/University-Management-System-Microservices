package com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Request;

import java.time.LocalDate;

public record UpdateCourseRequest(
        String name,
        String description,
        String courseCode,
        LocalDate startDate,
        LocalDate endDate,
        String departmentName,
        Long userId,
        int creditHours,
        int maxStudents) {
}
