package com.unisystem.academic_core_service.infrastructure.adapters.in.http;

import com.unisystem.academic_core_service.domain.application.port.in.EnrollStudentUseCase;
import com.unisystem.academic_core_service.domain.application.port.out.CourseRepositoryPort;
import com.unisystem.academic_core_service.domain.application.port.out.EnrollmentRepositoryPort;
import com.unisystem.academic_core_service.domain.exceptions.InvalidEnrollmentException;
import com.unisystem.academic_core_service.domain.model.Enrollment;
import com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Response.EnrolledCourseResponse;
import com.unisystem.academic_core_service.infrastructure.adapters.out.iam.IamClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enrolled-courses")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollStudentUseCase enrollStudentUseCase;
    private final EnrollmentRepositoryPort enrollmentRepositoryPort;
    private final CourseRepositoryPort courseRepositoryPort;
    private final IamClient iamClient;

    @PostMapping
    public ResponseEntity<Enrollment> enroll(@RequestBody EnrollRequest request) {
        Enrollment enrollment = enrollStudentUseCase.enroll(
                new EnrollStudentUseCase.EnrollCommand(request.studentId(), request.courseId()));
        return ResponseEntity.ok(enrollment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        enrollmentRepositoryPort.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/drop")
    public ResponseEntity<Void> drop(
            @RequestParam Long studentId,
            @RequestParam Long courseId) {
        enrollStudentUseCase.drop(studentId, courseId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<EnrolledCourseResponse>> getByStudentId(
            @PathVariable Long studentId,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        List<Enrollment> enrollments = enrollmentRepositoryPort.findByStudentId(studentId);
        IamClient.StudentBasicResponse studentBasic = iamClient.getStudentBasic(studentId, authorization);
        String studentName = studentBasic != null ? studentBasic.getUsername() : "Unknown";

        List<Long> courseIds = enrollments.stream()
                .map(Enrollment::getCourseId)
                .distinct()
                .toList();

        Map<Long, com.unisystem.academic_core_service.domain.model.Course> courseById = courseRepositoryPort.findByIds(courseIds)
                .stream()
                .collect(Collectors.toMap(
                        com.unisystem.academic_core_service.domain.model.Course::getId,
                        Function.identity()));

        Map<Long, IamClient.TeacherBasicResponse> teacherById = courseById.values().stream()
                .map(com.unisystem.academic_core_service.domain.model.Course::getTeacherId)
                .filter(teacherId -> teacherId != null)
                .distinct()
                .map(teacherId -> Map.entry(teacherId, iamClient.getTeacherBasic(teacherId, authorization)))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        List<EnrolledCourseResponse> responses = enrollments.stream()
                .map(enrollment -> {
                    com.unisystem.academic_core_service.domain.model.Course course = courseById
                            .get(enrollment.getCourseId());
                    if (course == null) {
                        return null;
                    }
                    IamClient.TeacherBasicResponse teacher = teacherById.get(course.getTeacherId());
                    String teacherName = teacher != null ? teacher.getTeacherName() : "Unknown";
                    return EnrolledCourseResponse.builder()
                            .id(enrollment.getId())
                            .studentId(enrollment.getStudentId())
                            .studentName(studentName)
                            .courseId(course.getId())
                            .courseCode(course.getCourseCode())
                            .courseName(course.getName())
                            .teacherName(teacherName)
                            .credits(course.getCredits())
                            .startDate(course.getStartDate() != null ? course.getStartDate().toString() : null)
                            .endDate(course.getEndDate() != null ? course.getEndDate().toString() : null)
                            .enrollmentDate(enrollment.getEnrolledAt() != null
                                    ? enrollment.getEnrolledAt().toString()
                                    : null)
                            .enrolledAt(enrollment.getEnrolledAt())
                            .build();
                })
                .filter(java.util.Objects::nonNull)
                .toList();

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<EnrolledCourseResponse>> getByCourseId(
            @PathVariable Long courseId,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        List<Enrollment> enrollments = enrollmentRepositoryPort.findByCourseId(courseId);
        com.unisystem.academic_core_service.domain.model.Course course = courseRepositoryPort.findByIds(List.of(courseId))
                .stream()
                .findFirst()
                .orElse(null);

        if (course == null) {
            return ResponseEntity.ok(List.of());
        }

        IamClient.TeacherBasicResponse teacher = course.getTeacherId() != null
                ? iamClient.getTeacherBasic(course.getTeacherId(), authorization)
                : null;
        String teacherName = teacher != null ? teacher.getTeacherName() : "Unknown";

        Map<Long, String> studentNameById = enrollments.stream()
                .map(Enrollment::getStudentId)
                .distinct()
                .collect(Collectors.toMap(
                        Function.identity(),
                        studentId -> {
                            IamClient.StudentBasicResponse student = iamClient.getStudentBasic(studentId, authorization);
                            return student != null ? student.getUsername() : "Unknown";
                        }));

        List<EnrolledCourseResponse> responses = enrollments.stream()
                .map(enrollment -> EnrolledCourseResponse.builder()
                        .id(enrollment.getId())
                        .studentId(enrollment.getStudentId())
                        .studentName(studentNameById.getOrDefault(enrollment.getStudentId(), "Unknown"))
                        .courseId(course.getId())
                        .courseCode(course.getCourseCode())
                        .courseName(course.getName())
                        .teacherName(teacherName)
                        .credits(course.getCredits())
                        .startDate(course.getStartDate() != null ? course.getStartDate().toString() : null)
                        .endDate(course.getEndDate() != null ? course.getEndDate().toString() : null)
                        .enrollmentDate(enrollment.getEnrolledAt() != null
                                ? enrollment.getEnrolledAt().toString()
                                : null)
                        .enrolledAt(enrollment.getEnrolledAt())
                        .build())
                .toList();

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<Enrollment> getByStudentAndCourse(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        Enrollment enrollment = enrollmentRepositoryPort.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new InvalidEnrollmentException(
                        "Enrollment not found for student " + studentId + " in course " + courseId));
        return ResponseEntity.ok(enrollment);
    }

    public record EnrollRequest(Long studentId, Long courseId) {
    }

}
