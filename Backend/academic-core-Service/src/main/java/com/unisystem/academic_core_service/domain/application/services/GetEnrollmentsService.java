package com.unisystem.academic_core_service.domain.application.services;

import com.unisystem.academic_core_service.domain.application.port.in.GetEnrollmentQuery;
import com.unisystem.academic_core_service.domain.application.port.out.EnrollmentRepositoryPort;
import com.unisystem.academic_core_service.domain.model.Enrollment;

import java.util.List;
import java.util.Optional;

public class GetEnrollmentsService implements GetEnrollmentQuery {

    private final EnrollmentRepositoryPort enrollmentRepository;

    public GetEnrollmentsService(EnrollmentRepositoryPort enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    @Override

    public List<Enrollment> getEnrollmentsByStudentId(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    @Override

    public List<Enrollment> getEnrollmentsByCourseId(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    @Override

    public Optional<Enrollment> getEnrollment(Long studentId, Long courseId) {
        return enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId);
    }

    @Override

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }
}
