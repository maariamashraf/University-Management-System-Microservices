package com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.repository;

import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.FeedbackEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackJpaRepository extends JpaRepository<FeedbackEntity, Long> {
    List<FeedbackEntity> findByCourseId(Long courseId);
    List<FeedbackEntity> findByUserId(Long userId);
}
