package com.unisystem.academic_core_service.domain.application.port.out;

import com.unisystem.academic_core_service.domain.model.Announcement;

import java.util.List;

public interface AnnouncementRepositoryPort {
    Announcement save(Announcement announcement);

    List<Announcement> findByCourseId(Long courseId);
}
