package com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Request;

import java.time.LocalDate;

public record CreateCourseRequest (String name,
                                   String courseCode,
                                   String description,
                                   int maxStudents,
                                   int credits,
                                   Long departmentId,
                                   Long teacherId,
                                   LocalDate startDate,
                                   LocalDate endDate) {
}
