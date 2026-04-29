package com.unisystem.academic_core_service.domain.events;

import java.time.LocalDateTime;

public record AnnouncementCreatedEvent(String id, String courseId, LocalDateTime createdAt) {
}
