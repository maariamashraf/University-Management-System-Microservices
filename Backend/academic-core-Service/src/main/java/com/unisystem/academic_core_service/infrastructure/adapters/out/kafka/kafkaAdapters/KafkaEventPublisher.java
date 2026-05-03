package com.unisystem.academic_core_service.infrastructure.adapters.out.kafka.kafkaAdapters;

import com.unisystem.academic_core_service.domain.application.port.out.EventPublisherPort;
import com.unisystem.academic_core_service.domain.events.AnnouncementCreatedEvent;
import com.unisystem.academic_core_service.domain.events.CourseCreatedEvent;
import com.unisystem.academic_core_service.domain.events.StudentEnrollend;
import com.unisystem.academic_core_service.infrastructure.adapters.out.kafka.kafkaConifg.KafkaTopics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaEventPublisher implements EventPublisherPort {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void publishStudentEnrolled(StudentEnrollend event) {
        String key = event.studentId();
        kafkaTemplate.send(KafkaTopics.STUDENT_ENROLLED, key, event)
                .thenAccept(result -> log.info(
                        "Published StudentEnrolled → topic={} partition={} offset={} key={}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset(),
                        key
                ))
                .exceptionally(ex -> {
                    log.error("Failed to publish StudentEnrolled event: {}", ex.getMessage(), ex);
                    return null;
                });
    }

    @Override
    public void publishCourseCreated(CourseCreatedEvent event) {
        String key = event.courseId();
        kafkaTemplate.send(KafkaTopics.COURSE_CREATED, key, event)
                .thenAccept(result -> log.info(
                        "Published CourseCreated → topic={} partition={} offset={} key={}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset(),
                        key
                ))
                .exceptionally(ex -> {
                    log.error("Failed to publish CourseCreated event: {}", ex.getMessage(), ex);
                    return null;
                });
    }

    @Override
    public void publishAnnouncementCreated(AnnouncementCreatedEvent event) {
        String key = event.id();
        kafkaTemplate.send(KafkaTopics.ANNOUNCEMENT_CREATED, key, event)
                .thenAccept(result -> log.info(
                        "Published AnnouncementCreated → topic={} partition={} offset={} key={}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset(),
                        key
                ))
                .exceptionally(ex -> {
                    log.error("Failed to publish AnnouncementCreated event: {}", ex.getMessage(), ex);
                    return null;
                });
    }
}
