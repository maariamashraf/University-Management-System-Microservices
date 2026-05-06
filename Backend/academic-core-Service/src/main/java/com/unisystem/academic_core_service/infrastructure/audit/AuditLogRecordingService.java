package com.unisystem.academic_core_service.infrastructure.audit;

import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.AuditLogEntity;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.repository.AuditLogJpaRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditLogRecordingService {

    private static final Logger log = LoggerFactory.getLogger(AuditLogRecordingService.class);

    private final AuditLogJpaRepository auditLogJpaRepository;

    @Transactional
    public void record(
            Long userId,
            String userName,
            String userRole,
            String action,
            String details,
            String ipAddress) {
        AuditLogEntity entity = AuditLogEntity.builder()
                .userId(userId)
                .userName(userName)
                .userRole(userRole)
                .action(action)
                .details(details)
                .ipAddress(ipAddress)
                .createdAt(LocalDateTime.now())
                .build();
        try {
            auditLogJpaRepository.save(entity);
        } catch (Exception ex) {
            log.warn("Failed to persist audit log: {}", ex.getMessage());
        }
    }
}
