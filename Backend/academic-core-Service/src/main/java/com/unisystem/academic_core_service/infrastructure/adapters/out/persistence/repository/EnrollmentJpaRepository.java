package com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.repository;

import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.EnrollmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentJpaRepository extends JpaRepository<EnrollmentEntity, Long> {
    Optional<EnrollmentEntity> findByStudentIdAndCourseId(Long studentId, Long courseId);
    List<EnrollmentEntity> findByStudentId(Long studentId);
    List<EnrollmentEntity> findByCourseId(Long courseId);
}
