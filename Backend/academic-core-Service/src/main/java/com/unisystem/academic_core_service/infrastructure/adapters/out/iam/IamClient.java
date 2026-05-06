package com.unisystem.academic_core_service.infrastructure.adapters.out.iam;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;


@FeignClient(name = "iam-service", fallback = IamClientFallbackFactory.class)
public interface IamClient {

    @GetMapping("/api/teachers/basic/{teacherId}")
    TeacherBasicResponse getTeacherBasic(
            @PathVariable Long teacherId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    );

    @GetMapping("/api/students/basic/{id}")
    StudentBasicResponse getStudentBasic(
            @PathVariable("id") Long studentId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    );

    @GetMapping("/api/students/basic/{id}")
    String getStudentBasicRaw(
            @PathVariable("id") Long studentId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    );

    // ── DTOs ─────────────────────────────────────────────────────────────
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    class TeacherBasicResponse {
        private Long id;
        @JsonAlias({"name", "fullName", "username", "userName", "teacherUsername", "teacherName"})
        private String teacherName;
        private String officeLocation;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    class StudentBasicResponse {
        @JsonAlias({"username", "userName", "name", "fullName", "studentName"})
        private String username;

          public String resolveUsername() {
            return (username == null || username.isBlank()) ? "Unknown" : username;
        }
    }
}