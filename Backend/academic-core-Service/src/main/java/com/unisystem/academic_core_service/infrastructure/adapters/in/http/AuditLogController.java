package com.unisystem.academic_core_service.infrastructure.adapters.in.http;

import com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Response.AuditLogResponse;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.AuditLogEntity;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.repository.AuditLogJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogJpaRepository auditLogJpaRepository;

    @GetMapping
    public ResponseEntity<List<AuditLogResponse>> findAll() {
        return ResponseEntity.ok(
                auditLogJpaRepository.findAllByOrderByCreatedAtDesc().stream()
                        .map(this::toResponse)
                        .toList());
    }

    @GetMapping("/action/{action}")
    public ResponseEntity<List<AuditLogResponse>> findByAction(@PathVariable String action) {
        return ResponseEntity.ok(
                auditLogJpaRepository.findByActionOrderByCreatedAtDesc(action).stream()
                        .map(this::toResponse)
                        .toList());
    }

    @GetMapping("/last-week-students-logs")
    public ResponseEntity<List<AuditLogResponse>> lastWeekStudentLogs() {
        return ResponseEntity.ok(
                auditLogJpaRepository
                        .findByUserRoleSince("STUDENT", LocalDateTime.now().minusDays(7))
                        .stream()
                        .map(this::toResponse)
                        .toList());
    }

    @GetMapping("/last-week-teachers-logs")
    public ResponseEntity<List<AuditLogResponse>> lastWeekTeacherLogs() {
        return ResponseEntity.ok(
                auditLogJpaRepository
                        .findByUserRoleSince("TEACHER", LocalDateTime.now().minusDays(7))
                        .stream()
                        .map(this::toResponse)
                        .toList());
    }

    @GetMapping("/last-week-admins-logs")
    public ResponseEntity<List<AuditLogResponse>> lastWeekAdminLogs() {
        return ResponseEntity.ok(
                auditLogJpaRepository
                        .findByUserRoleSince("ADMIN", LocalDateTime.now().minusDays(7))
                        .stream()
                        .map(this::toResponse)
                        .toList());
    }

    private AuditLogResponse toResponse(AuditLogEntity entity) {
        return AuditLogResponse.builder()
                .id(entity.getId())
                .userId(entity.getUserId() != null ? entity.getUserId() : 0L)
                .userName(entity.getUserName() != null ? entity.getUserName() : "")
                .action(entity.getAction())
                .details(entity.getDetails() != null ? entity.getDetails() : "")
                .ipAddress(entity.getIpAddress() != null ? entity.getIpAddress() : "")
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
