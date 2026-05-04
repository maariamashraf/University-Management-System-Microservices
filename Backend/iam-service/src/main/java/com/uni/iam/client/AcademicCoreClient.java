package com.uni.iam.client;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Component
public class AcademicCoreClient {

    private final RestTemplate restTemplate;
    private final String academicCoreBaseUrl;

    public AcademicCoreClient(RestTemplate restTemplate,
            @Value("${app.academic-core-base-url:http://localhost:8082}") String academicCoreBaseUrl) {
        this.restTemplate = restTemplate;
        this.academicCoreBaseUrl = academicCoreBaseUrl;
    }

    public List<CourseRemoteResponse> getCoursesByTeacherId(Long teacherId) {
        return getList(academicCoreBaseUrl + "/api/courses/teacher/" + teacherId,
                new ParameterizedTypeReference<List<CourseRemoteResponse>>() {
                });
    }

    public List<CourseRemoteResponse> getAllCourses() {
        return getList(academicCoreBaseUrl + "/api/courses/all",
                new ParameterizedTypeReference<List<CourseRemoteResponse>>() {
                });
    }

    public CourseRemoteResponse getCourseById(Long courseId) {
        return restTemplate.getForObject(academicCoreBaseUrl + "/api/courses/" + courseId, CourseRemoteResponse.class);
    }

    public List<EnrollmentRemoteResponse> getEnrollmentsByStudentId(Long studentId) {
        return getList(academicCoreBaseUrl + "/api/enrolled-courses/student/" + studentId,
                new ParameterizedTypeReference<List<EnrollmentRemoteResponse>>() {
                });
    }

    public List<AnnouncementRemoteResponse> getAnnouncementsByCourseId(Long courseId) {
        return getList(academicCoreBaseUrl + "/api/announcements/course/" + courseId,
                new ParameterizedTypeReference<List<AnnouncementRemoteResponse>>() {
                });
    }

    private <T> List<T> getList(String url, ParameterizedTypeReference<List<T>> typeReference) {
        try {
            List<T> response = restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, null, typeReference)
                    .getBody();
            return response == null ? Collections.emptyList() : response;
        } catch (RestClientException ex) {
            return Collections.emptyList();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseRemoteResponse {
        private Long id;
        private String name;
        private String courseCode;
        private String description;
        private LocalDate startDate;
        private LocalDate endDate;
        private LocalDate createdAt;
        private int credits;
        private int maxStudents;
        private int enrolledCount;
        private Long departmentId;
        private Long teacherId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EnrollmentRemoteResponse {
        private Long id;
        private Long studentId;
        private Long courseId;
        private LocalDateTime enrolledAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnnouncementRemoteResponse {
        private Long id;
        private String title;
        private String description;
        private Long courseId;
        private LocalDateTime createdAt;
    }
}