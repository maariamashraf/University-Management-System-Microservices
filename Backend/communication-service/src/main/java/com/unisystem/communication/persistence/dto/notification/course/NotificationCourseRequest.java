package com.unisystem.communication.persistence.dto.notification.course;

import com.unisystem.communication.persistence.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationCourseRequest {

    private Long courseId;
    private String title;
    private String message;

    @Builder.Default
    private NotificationType type = NotificationType.SYSTEM;
}
