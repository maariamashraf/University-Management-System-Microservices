package com.unisystem.api_gateway.controller;
import com.unisystem.api_gateway.dto.DashboardDtos;
import com.unisystem.api_gateway.service.DashboardAggregationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/gateway/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardAggregationService dashboardAggregationService;

    @GetMapping("/student/{id}")
    public Mono<ResponseEntity<DashboardDtos.StudentDashboardResponseDto>> getStudentDetails(
            @PathVariable("id") Long studentId,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String token) {

        log.info("BFF: Fetching student details for student ID: {}", studentId);
        return dashboardAggregationService.getStudentDashboard(studentId, token)
                .map(ResponseEntity::ok)
                .doOnError(error -> log.error("BFF: Error fetching student details: {}", error.getMessage()));
    }

    @GetMapping("/teacher/{id}")
    public Mono<ResponseEntity<DashboardDtos.TeacherDashboardResponseDto>> getTeacherDetails(
            @PathVariable("id") Long teacherId,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String token) {

        log.info("BFF: Fetching teacher details for teacher ID: {}", teacherId);
        return dashboardAggregationService.getTeacherDashboard(teacherId, token)
                .map(ResponseEntity::ok)
                .doOnError(error -> log.error("BFF: Error fetching teacher details: {}", error.getMessage()));
    }

    @GetMapping("/user")
    public Mono<ResponseEntity<DashboardDtos.UserDashboardResponseDto>> getUserDashboard(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String token) {

        return dashboardAggregationService.getCurrentUserDashboard(token)
                .map(ResponseEntity::ok)
                .doOnSuccess(response -> log.info("BFF: Successfully fetched user dashboard data"))
                .doOnError(error -> log.error("BFF: Error fetching dashboard data: {}", error.getMessage()));
    }
}
