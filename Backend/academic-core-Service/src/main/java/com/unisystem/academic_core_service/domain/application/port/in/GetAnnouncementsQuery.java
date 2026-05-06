package com.unisystem.academic_core_service.domain.application.port.in;

import java.time.LocalDateTime;
import java.util.List;

public interface GetAnnouncementsQuery {
    List<AnnouncementDTO> getAnnouncementsByCourseId(Long courseId);
    List<AnnouncementDTO> getAnnouncementsByStudentId(Long studentId);
    List<AnnouncementDTO> getAnnouncementsByTeacherId(Long teacherId);

    record AnnouncementDTO(
            Long id,
            String title,
            String content,
            Long courseId,
            LocalDateTime createdAt
    ) {
    }
}
