package com.unisystem.academic_core_service.infrastructure.adapters.in.http;

import com.unisystem.academic_core_service.domain.application.port.in.CreateAnnouncementUseCase;
import com.unisystem.academic_core_service.domain.application.port.in.GetAnnouncementsQuery;
import com.unisystem.academic_core_service.domain.model.Announcement;
import com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Request.CreateAnnouncementRequest;
import com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Response.AnnouncementResponse;
import com.unisystem.academic_core_service.infrastructure.aop.annotations.AuditLog;
import com.unisystem.academic_core_service.infrastructure.aop.annotations.CourseTeacherOnly;
import com.unisystem.academic_core_service.infrastructure.aop.annotations.TeachersOnly;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final CreateAnnouncementUseCase createAnnouncementUseCase;
    private final GetAnnouncementsQuery getAnnouncementsQuery;

    @TeachersOnly
    @CourseTeacherOnly(bodyParam = "request")
    @AuditLog(action = "CREATE_ANNOUNCEMENT")
    @PostMapping("/create")
    public ResponseEntity<AnnouncementResponse> createAnnouncement(@RequestBody CreateAnnouncementRequest request) {
        Announcement savedAnnouncement = createAnnouncementUseCase.create(
                new CreateAnnouncementUseCase.CreateAnnouncementCommand(
                        request.title(),
                        request.content(),
                        request.courseId(),
                        request.createdAt()
                )
        );

        return ResponseEntity.ok(toResponse(savedAnnouncement));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<AnnouncementResponse>> getAnnouncementsByCourseId(@PathVariable Long courseId) {
        List<AnnouncementResponse> responses = getAnnouncementsQuery.getAnnouncementsByCourseId(courseId)
                .stream()
                .map(announcement -> new AnnouncementResponse(
                        announcement.id(),
                        announcement.title(),
                        announcement.content(),
                        announcement.courseId(),
                        announcement.createdAt()
                ))
                .toList();

        return ResponseEntity.ok(responses);
    }

    private AnnouncementResponse toResponse(Announcement announcement) {
        return new AnnouncementResponse(
                announcement.getId(),
                announcement.getTitle(),
                announcement.getContent(),
                announcement.getCourseId(),
                announcement.getCreatedAt()
        );
    }
}
