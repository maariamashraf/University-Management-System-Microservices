package com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrolledCourseResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private String teacherName;
    private int credits;
    private String startDate;
    private String endDate;
    private String enrollmentDate;
    private LocalDateTime enrolledAt;
}
