package com.unisystem.academic_core_service.domain.application.services;

import com.unisystem.academic_core_service.domain.application.port.in.CreateCourseUseCase;
import com.unisystem.academic_core_service.domain.application.port.out.CourseRepositoryPort;
import com.unisystem.academic_core_service.domain.application.port.out.EventPublisherPort;
import com.unisystem.academic_core_service.domain.events.CourseCreatedEvent;
import com.unisystem.academic_core_service.domain.model.Course;

import java.time.LocalDate;

public class CreateCourseService implements CreateCourseUseCase {

    private final CourseRepositoryPort courseRepository;
    private final EventPublisherPort eventPublisher;

    public CreateCourseService(CourseRepositoryPort courseRepository, EventPublisherPort eventPublisher) {
        this.courseRepository = courseRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public Course create(CreateCourseCommand cmd) {
        Boolean exists = courseRepository.existsByCourseCode(cmd.courseCode());
        if (exists) {
            throw new RuntimeException("Course code already exists");
        }

        if (cmd.startDate() != null && cmd.endDate() != null && cmd.endDate().isBefore(cmd.startDate())) {
            throw new RuntimeException("End date cannot be before start date");
        }

        Course course = new Course();
        course.setName(cmd.name());
        course.setCourseCode(cmd.courseCode());
        course.setDescription(cmd.description());
        course.setMaxStudents(cmd.maxStudents());
        course.setCredits(cmd.credits());
        course.setDepartmentId(cmd.departmentId());
        course.setTeacherId(cmd.teacherId());
        course.setStartDate(cmd.startDate());
        course.setEndDate(cmd.endDate());
        course.setEnrolledCount(0);
        course.setCreatedAt(LocalDate.from(java.time.LocalDateTime.now()));
        Course savedCourse = courseRepository.save(course);
        CourseCreatedEvent event = new CourseCreatedEvent(savedCourse.getId().toString(), savedCourse.getName(), savedCourse.getCourseCode(),savedCourse.getCreatedAt());
        eventPublisher.publishCourseCreated(event);
        return savedCourse;
    }
}
