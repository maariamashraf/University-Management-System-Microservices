package com.uni.iam.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherCourseResponse {

    private Long id;
    private String name;
    private String description;
    private String departmentName;
    private String teacherUserName;
    private int creditHours;
    private int maxStudents;
    private int enrolledStudents;
}