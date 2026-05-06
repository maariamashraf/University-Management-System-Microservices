package com.unisystem.academic_core_service.infrastructure.adapters.in.http.Dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseCardResponse {

    private Long id;
    private String name;
    private String description;
    private String department;
    private String courseCode;
    private LocalDate startDate;
    private LocalDate endDate;
    private String teacherName;
    private int credits;
    private int maxStudents;
    private int enrolledStudents;
    private int enrolledCount;
    private String teacherUserName;
    private Integer creditHours;
}
