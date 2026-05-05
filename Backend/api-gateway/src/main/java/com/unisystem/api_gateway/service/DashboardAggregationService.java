package com.unisystem.api_gateway.service;

import com.unisystem.api_gateway.dto.DashboardDtos;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardAggregationService {

    private final WebClient.Builder webClientBuilder;

    @Value("${jwt.secret}")
    private String jwtSecret;

    public Mono<DashboardDtos.StudentDashboardResponseDto> getStudentDashboard(Long studentId, String token) {
        Mono<DashboardDtos.StudentProfileDto> profileMono = callGet(
                "http://iam-service:8081/api/students/details/{id}",
                token,
                DashboardDtos.StudentProfileDto.class,
                studentId);

        Mono<List<DashboardDtos.EnrollmentDto>> enrollmentsMono = callGetList(
                "http://academic-core:8082/api/enrolled-courses/student/{id}",
                token,
                DashboardDtos.EnrollmentDto.class,
                studentId).onErrorResume(error -> {
                    log.warn("BFF: Failed to fetch enrollments for student {}: {}", studentId, error.getMessage());
                    return Mono.just(List.of());
                });

        return Mono.zip(profileMono, enrollmentsMono)
                .flatMap(tuple -> {
                    DashboardDtos.StudentProfileDto profile = tuple.getT1();
                    List<DashboardDtos.EnrollmentDto> enrollments = tuple.getT2();

                    List<Long> courseIds = enrollments.stream()
                            .map(DashboardDtos.EnrollmentDto::courseId)
                            .filter(id -> id != null)
                            .collect(java.util.stream.Collectors.collectingAndThen(
                                    java.util.stream.Collectors.toCollection(LinkedHashSet::new),
                                    List::copyOf));

                    Mono<List<DashboardDtos.CourseDto>> coursesMono = courseIds.isEmpty()
                            ? Mono.just(List.of())
                            : callPost(
                                    "http://academic-core:8082/api/courses/by-ids",
                                    token,
                                    new DashboardDtos.CourseIdsRequestDto(courseIds),
                                    new ParameterizedTypeReference<List<DashboardDtos.CourseDto>>() {
                                    }).onErrorResume(error -> {
                                        log.warn("BFF: Failed to fetch bulk courses for student {}: {}", studentId,
                                                error.getMessage());
                                        return Mono.just(List.of());
                                    });

                    return coursesMono.map(
                            courses -> new DashboardDtos.StudentDashboardResponseDto(profile, enrollments, courses));
                });
    }

    public Mono<DashboardDtos.TeacherDashboardResponseDto> getTeacherDashboard(Long teacherId, String token) {
        Mono<DashboardDtos.TeacherProfileDto> profileMono = callGet(
                "http://iam-service:8081/api/teachers/details/{id}",
                token,
                DashboardDtos.TeacherProfileDto.class,
                teacherId);

        Mono<List<DashboardDtos.CourseDto>> coursesMono = callGetList(
                "http://academic-core:8082/api/courses/teacher/{id}",
                token,
                DashboardDtos.CourseDto.class,
                teacherId).onErrorResume(error -> {
                    log.warn("BFF: Failed to fetch teacher courses for teacher {}: {}", teacherId, error.getMessage());
                    return Mono.just(List.of());
                });

        return Mono.zip(profileMono, coursesMono)
                .map(tuple -> {
                    DashboardDtos.TeacherProfileDto profile = tuple.getT1();
                    List<DashboardDtos.CourseDto> courses = tuple.getT2();
                    List<DashboardDtos.TeacherCourseSummaryDto> mappedCourses = courses.stream()
                            .map(course -> toTeacherCourseSummary(course, profile))
                            .toList();
                    return new DashboardDtos.TeacherDashboardResponseDto(profile, mappedCourses, mappedCourses.size());
                });
    }

    private DashboardDtos.TeacherCourseSummaryDto toTeacherCourseSummary(
            DashboardDtos.CourseDto course,
            DashboardDtos.TeacherProfileDto profile) {
        if (course == null) {
            return null;
        }
        DashboardDtos.TeacherCourseSummaryDto profileCourse = findProfileCourse(profile, course.id());
        return new DashboardDtos.TeacherCourseSummaryDto(
                course.id(),
                course.name(),
                course.description(),
                profileCourse == null ? null : profileCourse.departmentName(),
                profileCourse == null ? null : profileCourse.teacherUserName(),
                profileCourse != null && profileCourse.creditHours() != null
                        ? profileCourse.creditHours()
                        : safeInt(course.credits()),
                safeInt(course.maxStudents()),
                safeInt(course.enrolledCount()));
    }

    private DashboardDtos.TeacherCourseSummaryDto findProfileCourse(
            DashboardDtos.TeacherProfileDto profile,
            Long courseId) {
        if (profile == null || profile.courses() == null || courseId == null) {
            return null;
        }
        return profile.courses().stream()
                .filter(course -> course != null && courseId.equals(course.id()))
                .findFirst()
                .orElse(null);
    }

    private int safeInt(Integer value) {
        return value == null ? 0 : value;
    }

    public Mono<DashboardDtos.UserDashboardResponseDto> getCurrentUserDashboard(String token) {
        return callGet("http://iam-service:8081/api/users/me", token, DashboardDtos.UserDto.class)
                .flatMap(user -> {
                    String role = normalizeRole(user.role());
                    if ("student".equals(role)) {
                        return getStudentDashboard(user.id(), token)
                                .map(studentDashboard -> new DashboardDtos.UserDashboardResponseDto(
                                        user,
                                        role,
                                        studentDashboard,
                                        null,
                                        null));
                    }

                    if ("teacher".equals(role)) {
                        return getTeacherDashboard(user.id(), token)
                                .map(teacherDashboard -> new DashboardDtos.UserDashboardResponseDto(
                                        user,
                                        role,
                                        null,
                                        teacherDashboard,
                                        null));
                    }

                    DashboardDtos.AdminDashboardResponseDto adminDashboard = new DashboardDtos.AdminDashboardResponseDto(
                            user.id(),
                            user.username(),
                            user.email(),
                            role);
                    return Mono
                            .just(new DashboardDtos.UserDashboardResponseDto(user, role, null, null, adminDashboard));
                });
    }

    private <T> Mono<T> callGet(String uriTemplate, String token, Class<T> responseType, Object... uriVariables) {
        HttpHeaders internalHeaders = buildInternalHeaders(token);
        return webClientBuilder
                .build()
                .get()
                .uri(uriTemplate, uriVariables)
                .headers(headers -> {
                    headers.addAll(internalHeaders);
                    if (token != null && !token.isBlank()) {
                        headers.set(HttpHeaders.AUTHORIZATION, token);
                    }
                    headers.set("Content-Type", "application/json");
                })
                .retrieve()
                .bodyToMono(responseType);
    }

    private <T> Mono<List<T>> callGetList(String uriTemplate, String token, Class<T> elementType,
            Object... uriVariables) {
        HttpHeaders internalHeaders = buildInternalHeaders(token);
        return webClientBuilder
                .build()
                .get()
                .uri(uriTemplate, uriVariables)
                .headers(headers -> {
                    headers.addAll(internalHeaders);
                    if (token != null && !token.isBlank()) {
                        headers.set(HttpHeaders.AUTHORIZATION, token);
                    }
                    headers.set("Content-Type", "application/json");
                })
                .retrieve()
                .bodyToFlux(elementType)
                .collectList();
    }

    private <B, T> Mono<T> callPost(
            String uriTemplate,
            String token,
            B requestBody,
            ParameterizedTypeReference<T> responseType,
            Object... uriVariables) {
        HttpHeaders internalHeaders = buildInternalHeaders(token);
        return webClientBuilder
                .build()
                .post()
                .uri(uriTemplate, uriVariables)
                .headers(headers -> {
                    headers.addAll(internalHeaders);
                    if (token != null && !token.isBlank()) {
                        headers.set(HttpHeaders.AUTHORIZATION, token);
                    }
                    headers.set("Content-Type", "application/json");
                })
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(responseType);
    }

    private HttpHeaders buildInternalHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        if (token == null || token.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing token");
        }

        String rawToken = token.startsWith("Bearer ") ? token.substring(7) : token;

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseClaimsJws(rawToken)
                    .getBody();

            Object userId = claims.get("userId");
            Object roles = claims.get("roles");

            if (userId != null) {
                headers.set("X-User-Id", userId.toString());
            }

            String roleValue = extractRoleValue(roles);
            if (roleValue != null) {
                headers.set("X-Roles", roleValue);
            }
        } catch (JwtException e) {
            log.warn("BFF: Failed to parse JWT for internal headers: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }

        return headers;
    }

    private String extractRoleValue(Object roles) {
        if (roles == null) {
            return null;
        }

        if (roles instanceof String text) {
            return normalizeRoleHeader(text);
        }

        if (roles instanceof List<?> list && !list.isEmpty()) {
            Object first = list.get(0);
            return first == null ? null : normalizeRoleHeader(first.toString());
        }

        if (roles instanceof Object[] array && array.length > 0) {
            return array[0] == null ? null : normalizeRoleHeader(array[0].toString());
        }

        return normalizeRoleHeader(roles.toString());
    }

    private String normalizeRoleHeader(String rawRoles) {
        if (rawRoles == null || rawRoles.isBlank()) {
            return null;
        }

        String cleaned = rawRoles.trim();

        if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
            cleaned = cleaned.substring(1, cleaned.length() - 1);
        }

        String first = cleaned.split("[,\\s]+", 2)[0].trim();
        if (first.isEmpty()) {
            return null;
        }

        return first.startsWith("ROLE_") ? first : "ROLE_" + first.toUpperCase(Locale.ROOT);
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "unknown";
        }
        return role.replace("ROLE_", "").toLowerCase(Locale.ROOT);
    }
}
