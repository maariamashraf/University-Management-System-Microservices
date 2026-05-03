package com.unisystem.academic_core_service.domain.events;

import java.time.LocalDateTime;

public record AnnouncementCreatedEvent(
        String id,
        String courseId,
        String courseName,
        String title,
        String description,
        LocalDateTime createdAt
) {
}
