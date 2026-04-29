package com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.repository;

import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.AnnouncementEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementJpaRepository extends JpaRepository<AnnouncementEntity, Long> {
    List<AnnouncementEntity> findByCourseIdOrderByCreatedAtDesc(Long courseId);
}
