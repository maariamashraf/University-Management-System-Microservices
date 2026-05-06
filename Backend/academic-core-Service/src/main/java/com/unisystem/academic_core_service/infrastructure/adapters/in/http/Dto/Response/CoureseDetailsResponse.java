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
public class CoureseDetailsResponse {
    private Long id;
    private String name;
    private String description;
    private String courseCode;
    private LocalDate startDate;
    private LocalDate endDate;
    private int credits;
    private int maxStudents;
    private int enrolledCount;
    private int teacherId;
    private String teacherName;
}
