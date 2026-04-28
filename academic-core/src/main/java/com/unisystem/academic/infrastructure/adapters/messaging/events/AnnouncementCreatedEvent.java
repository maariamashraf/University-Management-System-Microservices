package com.unisystem.academic.infrastructure.adapters.messaging.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnnouncementCreatedEvent {
    private Long announcementId;
    private Long courseId;
    private LocalDateTime occurredAt;
}
