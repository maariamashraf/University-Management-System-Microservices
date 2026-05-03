package com.unisystem.academic_core_service.domain.application.services;

import com.unisystem.academic_core_service.domain.application.port.in.CreateAnnouncementUseCase;
import com.unisystem.academic_core_service.domain.application.port.out.AnnouncementRepositoryPort;
import com.unisystem.academic_core_service.domain.application.port.out.CourseRepositoryPort;
import com.unisystem.academic_core_service.domain.application.port.out.EventPublisherPort;
import com.unisystem.academic_core_service.domain.events.AnnouncementCreatedEvent;
import com.unisystem.academic_core_service.domain.exceptions.CourseNotFoundException;
import com.unisystem.academic_core_service.domain.model.Announcement;
import com.unisystem.academic_core_service.domain.model.Course;

import java.time.LocalDateTime;

public class CreateAnnouncementService implements CreateAnnouncementUseCase {

    private final AnnouncementRepositoryPort announcementRepository;
    private final CourseRepositoryPort courseRepository;
    private final EventPublisherPort eventPublisher;

    public CreateAnnouncementService(
            AnnouncementRepositoryPort announcementRepository,
            CourseRepositoryPort courseRepository,
            EventPublisherPort eventPublisher
    ) {
        this.announcementRepository = announcementRepository;
        this.courseRepository = courseRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override

    public Announcement create(CreateAnnouncementCommand command) {
        if (command.courseId() == null) {
            throw new CourseNotFoundException("Course id is required");
        }
        Course course = courseRepository.findById(command.courseId())
                .orElseThrow(() -> new CourseNotFoundException(command.courseId()));

        Announcement announcement = new Announcement();
        announcement.setTitle(command.title());
        announcement.setContent(command.content());
        announcement.setCourseId(command.courseId());
        announcement.setCreatedAt(command.createdAt() != null ? command.createdAt() : LocalDateTime.now());

        Announcement savedAnnouncement = announcementRepository.save(announcement);

        AnnouncementCreatedEvent event = new AnnouncementCreatedEvent(
                savedAnnouncement.getId().toString(),
                savedAnnouncement.getCourseId().toString(),
                course.getName() != null ? course.getName() : "",
                savedAnnouncement.getTitle(),
                savedAnnouncement.getContent(),
                savedAnnouncement.getCreatedAt()
        );
        eventPublisher.publishAnnouncementCreated(event);

        return savedAnnouncement;
    }
}
