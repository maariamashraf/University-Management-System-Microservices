package com.unisystem.academic_core_service.domain.application.port.out;

import com.unisystem.academic_core_service.domain.model.Enrollment;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepositoryPort {
    Enrollment save(Enrollment enrollment);
    Optional<Enrollment> findById(Long id);
    List<Enrollment> findAll();
    Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);
    List<Enrollment> findByStudentId(Long studentId);
    List<Enrollment> findByCourseId(Long courseId);
    void deleteById(Long enrollmentId);

}