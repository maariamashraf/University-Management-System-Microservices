package com.unisystem.academic_core_service.domain.application.port.in;

import com.unisystem.academic_core_service.domain.model.Enrollment;

public interface EnrollStudentUseCase {
    Enrollment enroll(EnrollCommand cmd);
    void drop(Long studentId, Long courseId);

    record EnrollCommand(Long studentId, Long courseId) {}
}
