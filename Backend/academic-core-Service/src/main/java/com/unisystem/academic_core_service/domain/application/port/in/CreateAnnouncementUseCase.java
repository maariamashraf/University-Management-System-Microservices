package com.unisystem.academic_core_service.domain.application.port.in;

import com.unisystem.academic_core_service.domain.model.Announcement;

import java.time.LocalDateTime;

public interface CreateAnnouncementUseCase {
    Announcement create(CreateAnnouncementCommand command);

    record CreateAnnouncementCommand(
            String title,
            String content,
            Long courseId,
            LocalDateTime createdAt
    ) {
    }
}
