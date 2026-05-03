package com.unisystem.communication.messaging;

import com.unisystem.communication.service.NotificationService;
import com.unisystem.communication.persistence.dto.notification.course.NotificationCourseRequest;
import com.unisystem.communication.persistence.dto.notification.user.NotificationRequest;
import com.unisystem.communication.persistence.entity.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * SOLID — Single Responsibility: only handles Kafka event consumption.
 * SOLID — Dependency Inversion: depends on NotificationService interface.
 *
 * Listens to 4 topics:
 *   - student-enrolled
 *   - announcement-created
 *   - course-created
 *   - notification-push
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumer {

    private final NotificationService notificationService;

    // ── Topic: student-enrolled ───────────────────────────
    // Sent by Academic Core when a student enrolls in a course
    @KafkaListener(topics = "student-enrolled", groupId = "communication-group")
    public void onStudentEnrolled(Map<String, Object> event) {
        log.info("Received student-enrolled event: {}", event);
        try {
            Long studentId = toLong(event.get("studentId"));
            String courseName = String.valueOf(event.get("courseName"));

            NotificationRequest request = NotificationRequest.builder()
                    .recipientId(studentId)
                    .title("Enrollment Confirmed ✅")
                    .message("You have successfully enrolled in \"" + courseName + "\". Good luck!")
                    .type(NotificationType.ENROLLMENT)
                    .build();

            notificationService.sendNotificationToUser(request);
        } catch (Exception e) {
            log.error("Error handling student-enrolled event: {}", e.getMessage(), e);
        }
    }

    // ── Topic: announcement-created ───────────────────────
    // Sent by Academic Core when a teacher posts an announcement
    // Notifies ALL enrolled students in the course
    @KafkaListener(topics = "announcement-created", groupId = "communication-group")
    public void onAnnouncementCreated(Map<String, Object> event) {
        log.info("Received announcement-created event for course ID: {}", event.get("courseId"));
        try {
            Long courseId = toLong(event.get("courseId"));
            String courseNameStr = String.valueOf(event.get("courseName"));
            String title = String.valueOf(event.get("title"));
            String description = String.valueOf(event.get("description"));

            NotificationCourseRequest request = NotificationCourseRequest.builder()
                    .courseId(courseId)
                    .title("New Announcement in " + courseNameStr + " 📢")
                    .message(title + ": " + description)
                    .type(NotificationType.ANNOUNCEMENT)
                    .build();

            notificationService.sendNotificationToCourse(request);
        } catch (Exception e) {
            log.error("Error handling announcement-created event: {}", e.getMessage(), e);
        }
    }

    // ── Topic: course-created ─────────────────────────────
    // Sent by Academic Core when a new course is created
    @KafkaListener(topics = "course-created", groupId = "communication-group")
    public void onCourseCreated(Map<String, Object> event) {
        log.info("Received course-created event: {}", event);
        // No notifications needed for course creation — logged for future use
    }

    // ── Topic: notification-push ──────────────────────────
    // Generic push topic — any service can use this to push a notification
    @KafkaListener(topics = "notification-push", groupId = "communication-group")
    public void onNotificationPush(Map<String, Object> event) {
        log.info("Received notification-push event: {}", event);
        try {
            Long recipientId = toLong(event.get("recipientId"));
            String title = String.valueOf(event.get("title"));
            String message = String.valueOf(event.get("message"));
            String typeStr = event.containsKey("type")
                    ? String.valueOf(event.get("type"))
                    : "SYSTEM";

            NotificationRequest request = NotificationRequest.builder()
                    .recipientId(recipientId)
                    .title(title)
                    .message(message)
                    .type(NotificationType.valueOf(typeStr))
                    .build();

            notificationService.sendNotificationToUser(request);
        } catch (Exception e) {
            log.error("Error handling notification-push event: {}", e.getMessage(), e);
        }
    }

    // ── Helper ────────────────────────────────────────────

    private Long toLong(Object value) {
        if (value == null) throw new IllegalArgumentException("Value is null");
        if (value instanceof Long) return (Long) value;
        if (value instanceof Integer) return ((Integer) value).longValue();
        return Long.parseLong(value.toString());
    }
}
