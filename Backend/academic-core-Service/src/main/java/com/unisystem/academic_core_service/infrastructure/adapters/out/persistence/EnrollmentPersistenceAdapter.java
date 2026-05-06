package com.unisystem.academic_core_service.infrastructure.adapters.out.persistence;

import com.unisystem.academic_core_service.domain.application.port.out.EnrollmentRepositoryPort;
import com.unisystem.academic_core_service.domain.model.Enrollment;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.EnrollmentEntity;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.mapper.EnrollmentPersistenceMapper;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.repository.EnrollmentJpaRepository;
import com.unisystem.academic_core_service.infrastructure.config.CacheConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class EnrollmentPersistenceAdapter implements EnrollmentRepositoryPort {

    private final EnrollmentJpaRepository enrollmentJpaRepository;
    private final EnrollmentPersistenceMapper enrollmentPersistenceMapper;

    @Override

    public Enrollment save(Enrollment enrollment) {
        EnrollmentEntity saved = enrollmentJpaRepository.save(enrollmentPersistenceMapper.toEntity(enrollment));
        return enrollmentPersistenceMapper.toDomain(saved);
    }

    @Override
    public Optional<Enrollment> findById(Long id) {
        return enrollmentJpaRepository.findById(id).map(enrollmentPersistenceMapper::toDomain);
    }

    @Override
    public List<Enrollment> findAll() {
        return enrollmentJpaRepository.findAll().stream().map(enrollmentPersistenceMapper::toDomain).toList();
    }

    @Override
    public Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId) {
        return enrollmentJpaRepository.findByStudentIdAndCourseId(studentId, courseId).map(enrollmentPersistenceMapper::toDomain);
    }

    @Override
    public List<Enrollment> findByStudentId(Long studentId) {
        return enrollmentJpaRepository.findByStudentId(studentId).stream().map(enrollmentPersistenceMapper::toDomain).toList();
    }

    @Override
    public List<Enrollment> findByCourseId(Long courseId) {
        return enrollmentJpaRepository.findByCourseId(courseId).stream().map(enrollmentPersistenceMapper::toDomain).toList();
    }

    @Override
    public void deleteById(Long enrollmentId) {
        enrollmentJpaRepository.deleteById(enrollmentId);
    }
}
