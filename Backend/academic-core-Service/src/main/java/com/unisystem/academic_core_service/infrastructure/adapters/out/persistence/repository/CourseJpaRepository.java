package com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.repository;

import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.CourseEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseJpaRepository extends JpaRepository<CourseEntity, Long> {
    boolean existsByCourseCode(String courseCode);
    List<CourseEntity> findAllByOrderByEnrolledCountDesc(Pageable pageable);
    List<CourseEntity> findByTeacherId(Long teacherId);
    Optional<CourseEntity> findByNameIgnoreCase(String name);
    List<CourseEntity> findByDepartmentIdIn(List<Long> departmentIds);
}
