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
    @Caching(evict = {
            @CacheEvict(cacheNames = CacheConfig.ENROLLMENTS_BY_STUDENT_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.ENROLLMENTS_BY_COURSE_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.ENROLLMENT_BY_STUDENT_COURSE_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.ENROLLMENTS_ALL_CACHE, allEntries = true)
    })
    public Enrollment save(Enrollment enrollment) {
        EnrollmentEntity saved = enrollmentJpaRepository.save(enrollmentPersistenceMapper.toEntity(enrollment));
        return enrollmentPersistenceMapper.toDomain(saved);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.ENROLLMENTS_BY_STUDENT_CACHE, key = "#id")
    public Optional<Enrollment> findById(Long id) {
        return enrollmentJpaRepository.findById(id).map(enrollmentPersistenceMapper::toDomain);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.ENROLLMENTS_ALL_CACHE)
    public List<Enrollment> findAll() {
        return enrollmentJpaRepository.findAll().stream().map(enrollmentPersistenceMapper::toDomain).toList();
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.ENROLLMENT_BY_STUDENT_COURSE_CACHE, key = "#studentId + '-' + #courseId")
    public Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId) {
        return enrollmentJpaRepository.findByStudentIdAndCourseId(studentId, courseId).map(enrollmentPersistenceMapper::toDomain);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.ENROLLMENTS_BY_STUDENT_CACHE, key = "#studentId")
    public List<Enrollment> findByStudentId(Long studentId) {
        return enrollmentJpaRepository.findByStudentId(studentId).stream().map(enrollmentPersistenceMapper::toDomain).toList();
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.ENROLLMENTS_BY_COURSE_CACHE, key = "#courseId")
    public List<Enrollment> findByCourseId(Long courseId) {
        return enrollmentJpaRepository.findByCourseId(courseId).stream().map(enrollmentPersistenceMapper::toDomain).toList();
    }

    @Override
    @Caching(evict = {
            @CacheEvict(cacheNames = CacheConfig.ENROLLMENTS_BY_STUDENT_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.ENROLLMENTS_BY_COURSE_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.ENROLLMENT_BY_STUDENT_COURSE_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.ENROLLMENTS_ALL_CACHE, allEntries = true)
    })
    public void deleteById(Long enrollmentId) {
        enrollmentJpaRepository.deleteById(enrollmentId);
    }
}
