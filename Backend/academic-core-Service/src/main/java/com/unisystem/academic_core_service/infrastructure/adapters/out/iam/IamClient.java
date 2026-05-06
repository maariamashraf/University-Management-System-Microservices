package com.unisystem.academic_core_service.infrastructure.adapters.out.iam;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;

@Component
public class IamClient {

    private static final Logger logger = LoggerFactory.getLogger(IamClient.class);

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
            ResponseEntity<T> response = restTemplate.exchange(
                    Objects.requireNonNull(url),
                    Objects.requireNonNull(HttpMethod.GET),
                    entity,
                    Objects.requireNonNull(type));
            return response.getBody();
        } catch (RestClientException ex) {
            logger.warn("IAM GET request failed. url={}, responseType={}, hasAuthHeader={}, error={}",
                    url, type.getSimpleName(), authHeader != null && !authHeader.isBlank(), ex.getMessage());
            return null;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeacherBasicResponse {
        private Long id;
        @JsonAlias({"name", "fullName", "username", "userName","teacherUsername","teacherName"})
        private String teacherName;
        private String officeLocation;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentBasicResponse {
        @JsonAlias({ "username", "userName", "name" })
        private String username;

        public String resolveUsername() {
            if (username == null || username.isBlank()) {
                return "Unknown";
            }
            return username;
        }
    }

}
