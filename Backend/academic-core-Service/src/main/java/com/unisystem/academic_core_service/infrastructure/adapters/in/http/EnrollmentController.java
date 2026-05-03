package com.unisystem.academic_core_service.infrastructure.adapters.in.http;

import com.unisystem.academic_core_service.domain.application.port.in.EnrollStudentUseCase;
import com.unisystem.academic_core_service.domain.application.port.out.EnrollmentRepositoryPort;
import com.unisystem.academic_core_service.domain.model.Enrollment;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrolled-courses")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollStudentUseCase enrollStudentUseCase;
    private final EnrollmentRepositoryPort enrollmentRepositoryPort;

    @PostMapping
    public ResponseEntity<Enrollment> enroll(@RequestBody EnrollRequest request) {
        Enrollment enrollment = enrollStudentUseCase.enroll(
                new EnrollStudentUseCase.EnrollCommand(request.studentId(), request.courseId())
        );
        return ResponseEntity.ok(enrollment);
    }

    @DeleteMapping("/drop")
    public ResponseEntity<Void> drop(
            @RequestParam Long studentId,
            @RequestParam Long courseId
    ) {
        enrollStudentUseCase.drop(studentId, courseId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Enrollment>> getByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(enrollmentRepositoryPort.findByStudentId(studentId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Enrollment>> getByCourseId(@PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentRepositoryPort.findByCourseId(courseId));
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<Enrollment> getByStudentAndCourse(
            @PathVariable Long studentId,
            @PathVariable Long courseId
    ) {
        Enrollment enrollment = enrollmentRepositoryPort.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        return ResponseEntity.ok(enrollment);
    }

    public record EnrollRequest(Long studentId, Long courseId) {
    }
}
