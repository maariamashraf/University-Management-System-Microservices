package com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.mapper;

import com.unisystem.academic_core_service.domain.model.Announcement;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.AnnouncementEntity;
import org.springframework.stereotype.Component;

@Component
public class AnnouncementPersistenceMapper {

    public AnnouncementEntity toEntity(Announcement announcement) {
        AnnouncementEntity entity = new AnnouncementEntity();
        entity.setId(announcement.getId());
        entity.setTitle(announcement.getTitle());
        entity.setContent(announcement.getContent());
        entity.setCourseId(announcement.getCourseId());
        entity.setCreatedAt(announcement.getCreatedAt());
        return entity;
    }

    public Announcement toDomain(AnnouncementEntity entity) {
        Announcement announcement = new Announcement();
        announcement.setId(entity.getId());
        announcement.setTitle(entity.getTitle());
        announcement.setContent(entity.getContent());
        announcement.setCourseId(entity.getCourseId());
        announcement.setCreatedAt(entity.getCreatedAt());
        return announcement;
    }
}
