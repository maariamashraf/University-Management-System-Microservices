package com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Request;

import java.time.LocalDateTime;

public record CreateAnnouncementRequest(
        String title,
        String content,
        Long courseId,
        LocalDateTime createdAt
) {
}
