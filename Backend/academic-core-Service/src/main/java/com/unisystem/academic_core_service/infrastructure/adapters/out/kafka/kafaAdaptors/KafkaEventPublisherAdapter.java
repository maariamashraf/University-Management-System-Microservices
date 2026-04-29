package com.unisystem.academic_core_service.infrastructure.adapters.out.kafka.kafaAdaptors;

import com.unisystem.academic_core_service.domain.application.port.out.EventPublisherPort;
import com.unisystem.academic_core_service.domain.events.CourseCreatedEvent;
import com.unisystem.academic_core_service.domain.events.StudentEnrollend;
import com.unisystem.academic_core_service.infrastructure.adapters.out.kafka.kafkaConifg.KafkaTopics;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaEventPublisherAdapter implements EventPublisherPort {

     private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void publishStudentEnrolled(StudentEnrollend event) {

     kafkaTemplate.send(KafkaTopics.STUDENT_ENROLLED, event);
    }

    @Override
    public void publishCourseCreated(CourseCreatedEvent event) {
        kafkaTemplate.send(KafkaTopics.COURSE_CREATED, event);
    }
}
