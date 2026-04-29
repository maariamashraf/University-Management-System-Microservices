package com.unisystem.academic_core_service.domain.application.port.in;

import com.unisystem.academic_core_service.domain.model.Course;

import java.time.LocalDate;

public interface CreateCourseUseCase {
    Course create(CreateCourseCommand cmd);

    record CreateCourseCommand(
            String name, String courseCode, String description,
            int maxStudents, int credits,
            Long departmentId, Long teacherId,
            LocalDate startDate, LocalDate endDate
    ) {}
}