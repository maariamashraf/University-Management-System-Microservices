package com.unisystem.academic_core_service.infrastructure.adapters.out.iam;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
public class IamClient {

    private final RestTemplate restTemplate;
    private final String iamBaseUrl;

    public IamClient(RestTemplate restTemplate,
            @Value("${app.iam-base-url:http://localhost:8081}") String iamBaseUrl) {
        this.restTemplate = restTemplate;
        this.iamBaseUrl = iamBaseUrl;
    }

    public TeacherBasicResponse getTeacherBasic(Long teacherId, String authHeader) {
        return get(iamBaseUrl + "/api/teachers/basic/" + teacherId, authHeader, TeacherBasicResponse.class);
    }

    public StudentBasicResponse getStudentBasic(Long studentId, String authHeader) {
        return get(iamBaseUrl + "/api/students/details/" + studentId, authHeader, StudentBasicResponse.class);
    }

    private <T> T get(String url, String authHeader, Class<T> type) {
        try {
            HttpHeaders headers = new HttpHeaders();
            if (authHeader != null && !authHeader.isBlank()) {
                headers.set(HttpHeaders.AUTHORIZATION, authHeader);
            }
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<T> response = restTemplate.exchange(url, HttpMethod.GET, entity, type);
            return response.getBody();
        } catch (RestClientException ex) {
            return null;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeacherBasicResponse {
        private Long id;
        private String teacherName;
        private String officeLocation;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentBasicResponse {
        private String username;
    }
}
