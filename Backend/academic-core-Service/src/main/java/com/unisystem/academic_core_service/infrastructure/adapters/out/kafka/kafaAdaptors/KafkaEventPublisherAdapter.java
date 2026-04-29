package com.unisystem.academic_core_service.infrastructure.adapters.out.kafka.kafaAdaptors;

import com.unisystem.academic_core_service.domain.application.port.out.EventPublisherPort;
import com.unisystem.academic_core_service.domain.events.AnnouncementCreatedEvent;
import com.unisystem.academic_core_service.domain.events.CourseCreatedEvent;
import com.unisystem.academic_core_service.domain.events.StudentEnrollend;
import com.unisystem.academic_core_service.infrastructure.adapters.out.kafka.kafkaConifg.KafkaTopics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaEventPublisherAdapter implements EventPublisherPort {

     private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void publishStudentEnrolled(StudentEnrollend event) {

     kafkaTemplate.send(KafkaTopics.STUDENT_ENROLLED, event)
             .thenAccept(result -> {
                 System.out.printf(
                         "Event published → topic=%s partition=%d offset=%d%n",
                         result.getRecordMetadata().topic(),
                         result.getRecordMetadata().partition(),
                         result.getRecordMetadata().offset()
                 );
             })
             .exceptionally(ex -> {
                 log.error("Failed to publish event: {}", ex.getMessage());
                 return null;
             });
    }

    @Override
    public void publishCourseCreated(CourseCreatedEvent event) {
        kafkaTemplate.send(KafkaTopics.COURSE_CREATED, event)
                .thenAccept(result -> {
                    System.out.printf(
                            "Event published → topic=%s partition=%d offset=%d%n",
                            result.getRecordMetadata().topic(),
                            result.getRecordMetadata().partition(),
                            result.getRecordMetadata().offset()
                    );
                })
                .exceptionally(ex -> {
                    log.error("Failed to publish event: {}", ex.getMessage());
                    return null;
                });
    }

    @Override
    public void publishAnnouncementCreated(AnnouncementCreatedEvent event) {
        kafkaTemplate.send(KafkaTopics.ANNOUNCEMENT_CREATED, event)
                .thenAccept(result -> {
                    System.out.printf(
                            "Event published → topic=%s partition=%d offset=%d%n",
                            result.getRecordMetadata().topic(),
                            result.getRecordMetadata().partition(),
                            result.getRecordMetadata().offset()
                    );
                })
                .exceptionally(ex -> {
                    log.error("Failed to publish event: {}", ex.getMessage());
                    return null;
                });
    }

}
