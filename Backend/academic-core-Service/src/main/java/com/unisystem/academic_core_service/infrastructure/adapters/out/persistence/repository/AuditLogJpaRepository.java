package com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.repository;

import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.AuditLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogJpaRepository extends JpaRepository<AuditLogEntity, Long> {

    List<AuditLogEntity> findAllByOrderByCreatedAtDesc();

    List<AuditLogEntity> findByActionOrderByCreatedAtDesc(String action);

    @Query("""
            SELECT e FROM AuditLogEntity e
            WHERE e.userRole = :role AND e.createdAt >= :since
            ORDER BY e.createdAt DESC
            """)
    List<AuditLogEntity> findByUserRoleSince(
            @Param("role") String role,
            @Param("since") LocalDateTime since);
}
