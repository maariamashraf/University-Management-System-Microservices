package com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String action;
    private String details;
    private String ipAddress;
    private LocalDateTime createdAt;
}
