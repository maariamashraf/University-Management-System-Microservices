package com.unisystem.academic_core_service.domain.application.port.in;

import com.unisystem.academic_core_service.domain.model.Enrollment;

import java.util.List;
import java.util.Optional;

public interface GetEnrollmentQuery {
    List<Enrollment> getEnrollmentsByStudentId(Long studentId);
    List<Enrollment> getEnrollmentsByCourseId(Long courseId);
    Optional<Enrollment> getEnrollment(Long studentId, Long courseId);
    List<Enrollment> getAllEnrollments();
}
