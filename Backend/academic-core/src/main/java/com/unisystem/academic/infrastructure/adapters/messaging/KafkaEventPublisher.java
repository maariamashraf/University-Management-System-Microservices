package com.unisystem.academic.infrastructure.adapters.messaging;

import com.unisystem.academic.domain.ports.out.EventPublisherPort;
import com.unisystem.academic.infrastructure.adapters.messaging.events.AnnouncementCreatedEvent;
import com.unisystem.academic.infrastructure.adapters.messaging.events.CourseCreatedEvent;
import com.unisystem.academic.infrastructure.adapters.messaging.events.StudentEnrolledEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaEventPublisher implements EventPublisherPort {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void publishStudentEnrolled(Long studentId, Long courseId) {
        StudentEnrolledEvent event = new StudentEnrolledEvent(studentId, courseId, LocalDateTime.now());
        String key = String.valueOf(studentId);
        log.info("Publishing student-enrolled event: key={}, payload={}", key, event);
        kafkaTemplate.send("student-enrolled", key, event);
    }

    @Override
    public void publishAnnouncementCreated(Long announcementId, Long courseId) {
        AnnouncementCreatedEvent event = new AnnouncementCreatedEvent(announcementId, courseId, LocalDateTime.now());
        String key = String.valueOf(announcementId);
        log.info("Publishing announcement-created event: key={}, payload={}", key, event);
        kafkaTemplate.send("announcement-created", key, event);
    }

    @Override
    public void publishCourseCreated(Long courseId, String courseName) {
        CourseCreatedEvent event = new CourseCreatedEvent(courseId, courseName, LocalDateTime.now());
        String key = String.valueOf(courseId);
        log.info("Publishing course-created event: key={}, payload={}", key, event);
        kafkaTemplate.send("course-created", key, event);
    }
}
