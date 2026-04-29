package com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Response;

import java.time.LocalDateTime;

public record AnnouncementResponse(
        Long id,
        String title,
        String content,
        Long courseId,
        LocalDateTime createdAt
) {
}
