package com.unisystem.academic_core_service.domain.application.services;

import com.unisystem.academic_core_service.domain.application.port.in.GetEnrollmentQuery;
import com.unisystem.academic_core_service.domain.application.port.out.EnrollmentRepositoryPort;
import com.unisystem.academic_core_service.domain.model.Enrollment;
import com.unisystem.academic_core_service.infrastructure.config.CacheConfig;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;
import java.util.Optional;

public class GetEnrollmentsService implements GetEnrollmentQuery {

    private final EnrollmentRepositoryPort enrollmentRepository;

    public GetEnrollmentsService(EnrollmentRepositoryPort enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.ENROLLMENTS_BY_STUDENT_CACHE, key = "#studentId")
    public List<Enrollment> getEnrollmentsByStudentId(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.ENROLLMENTS_BY_COURSE_CACHE, key = "#courseId")
    public List<Enrollment> getEnrollmentsByCourseId(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.ENROLLMENT_BY_STUDENT_COURSE_CACHE, key = "#studentId + '-' + #courseId")
    public Optional<Enrollment> getEnrollment(Long studentId, Long courseId) {
        return enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.ENROLLMENTS_ALL_CACHE)
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }
}
