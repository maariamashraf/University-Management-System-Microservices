package com.unisystem.academic_core_service.domain.application.port.out;

import com.unisystem.academic_core_service.domain.events.AnnouncementCreatedEvent;
import com.unisystem.academic_core_service.domain.events.CourseCreatedEvent;
import com.unisystem.academic_core_service.domain.events.StudentEnrollend;

public interface EventPublisherPort {
    void publishStudentEnrolled(StudentEnrollend event);

    void publishCourseCreated(CourseCreatedEvent event);

    void publishAnnouncementCreated(AnnouncementCreatedEvent event);
}
