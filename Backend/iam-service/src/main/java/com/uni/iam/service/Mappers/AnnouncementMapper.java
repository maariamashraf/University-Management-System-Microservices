package com.uni.iam.service.Mappers;

import com.uni.iam.client.AcademicCoreClient;
import com.uni.iam.dto.response.AnnouncementSummaryResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AnnouncementMapper {

    public List<AnnouncementSummaryResponse> toAnnouncementSummaries(
            List<AcademicCoreClient.CourseRemoteResponse> courses,
            AcademicCoreClient academicCoreClient) {
        return courses.stream()
                .flatMap(course -> academicCoreClient.getAnnouncementsByCourseId(course.getId()).stream())
                .map(announcement -> AnnouncementSummaryResponse.builder()
                        .id(announcement.getId())
                        .title(announcement.getTitle())
                        .description(announcement.getDescription())
                        .createdAt(announcement.getCreatedAt() != null ? announcement.getCreatedAt().toString() : null)
                        .type("default")
                        .build())
                .toList();
    }

    public List<AnnouncementSummaryResponse> toAnnouncementSummariesByCourseIds(
            List<Long> courseIds,
            AcademicCoreClient academicCoreClient) {
        return courseIds.stream()
                .distinct()
                .flatMap(courseId -> academicCoreClient.getAnnouncementsByCourseId(courseId).stream())
                .map(announcement -> AnnouncementSummaryResponse.builder()
                        .id(announcement.getId())
                        .title(announcement.getTitle())
                        .description(announcement.getDescription())
                        .createdAt(announcement.getCreatedAt() != null ? announcement.getCreatedAt().toString() : null)
                        .type("default")
                        .build())
                .toList();
    }
}
