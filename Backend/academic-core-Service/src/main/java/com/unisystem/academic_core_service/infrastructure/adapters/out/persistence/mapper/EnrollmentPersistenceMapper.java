package com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.mapper;

import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.EnrollmentEntity;
import com.unisystem.academic_core_service.domain.model.Enrollment;
import org.springframework.stereotype.Component;

@Component
public class EnrollmentPersistenceMapper {

    public EnrollmentEntity toEntity(Enrollment enrollment) {
        EnrollmentEntity entity = new EnrollmentEntity();
        entity.setId(enrollment.getId());
        entity.setStudentId(enrollment.getStudentId());
        entity.setCourseId(enrollment.getCourseId());
        entity.setEnrolledAt(enrollment.getEnrolledAt());
        return entity;
    }

    public Enrollment toDomain(EnrollmentEntity entity) {
        Enrollment enrollment = new Enrollment();
        enrollment.setId(entity.getId());
        enrollment.setStudentId(entity.getStudentId());
        enrollment.setCourseId(entity.getCourseId());
        enrollment.setEnrolledAt(entity.getEnrolledAt());
        return enrollment;
    }
}
