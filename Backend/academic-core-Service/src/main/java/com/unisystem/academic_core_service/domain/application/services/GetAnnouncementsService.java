package com.unisystem.academic_core_service.domain.application.services;

import com.unisystem.academic_core_service.domain.application.port.in.GetAnnouncementsQuery;
import com.unisystem.academic_core_service.domain.application.port.out.AnnouncementRepositoryPort;
import com.unisystem.academic_core_service.domain.model.Announcement;

import java.util.List;

public class GetAnnouncementsService implements GetAnnouncementsQuery {

    private final AnnouncementRepositoryPort announcementRepository;

    public GetAnnouncementsService(AnnouncementRepositoryPort announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    @Override

    public List<AnnouncementDTO> getAnnouncementsByCourseId(Long courseId) {
        List<Announcement> announcements = announcementRepository.findByCourseId(courseId);
        return announcements.stream()
                .map(this::toDto)
                .toList();
    }

    private AnnouncementDTO toDto(Announcement announcement) {
        return new AnnouncementDTO(
                announcement.getId(),
                announcement.getTitle(),
                announcement.getContent(),
                announcement.getCourseId(),
                announcement.getCreatedAt()
        );
    }
}
