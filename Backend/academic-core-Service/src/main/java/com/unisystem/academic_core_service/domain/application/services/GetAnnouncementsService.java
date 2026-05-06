package com.unisystem.academic_core_service.domain.application.services;

import com.unisystem.academic_core_service.domain.application.port.in.GetAnnouncementsQuery;
import com.unisystem.academic_core_service.domain.application.port.out.AnnouncementRepositoryPort;
import com.unisystem.academic_core_service.domain.application.port.out.CourseRepositoryPort;
import com.unisystem.academic_core_service.domain.application.port.out.EnrollmentRepositoryPort;
import com.unisystem.academic_core_service.domain.model.Announcement;
import com.unisystem.academic_core_service.domain.model.Course;
import com.unisystem.academic_core_service.domain.model.Enrollment;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;

public class GetAnnouncementsService implements GetAnnouncementsQuery {

    private final AnnouncementRepositoryPort announcementRepository;
    private final EnrollmentRepositoryPort enrollmentRepository;
    private final CourseRepositoryPort courseRepository;

    public GetAnnouncementsService(
            AnnouncementRepositoryPort announcementRepository,
            EnrollmentRepositoryPort enrollmentRepository,
            CourseRepositoryPort courseRepository) {
        this.announcementRepository = announcementRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public List<AnnouncementDTO> getAnnouncementsByCourseId(Long courseId) {
        List<Announcement> announcements = announcementRepository.findByCourseId(courseId);
        return announcements.stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public List<AnnouncementDTO> getAnnouncementsByStudentId(Long studentId) {
        List<Long> courseIds = enrollmentRepository.findByStudentId(studentId).stream()
                .map(Enrollment::getCourseId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        return courseIds.stream()
                .flatMap(courseId -> getAnnouncementsByCourseId(courseId).stream())
                .sorted(Comparator.comparing(
                        AnnouncementDTO::createdAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    @Override
    public List<AnnouncementDTO> getAnnouncementsByTeacherId(Long teacherId) {
        List<Long> courseIds = courseRepository.findByTeacherId(teacherId).stream()
                .map(Course::getId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        return courseIds.stream()
                .flatMap(courseId -> getAnnouncementsByCourseId(courseId).stream())
                .sorted(Comparator.comparing(
                        AnnouncementDTO::createdAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
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
