package com.uni.iam.service.impl.StudentSerivces;

import com.uni.iam.dto.response.StudentProfileResponse;
import com.uni.iam.service.interfaces.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StudentDashboardFacade {

    private final StudentService studentService;
    private final AcademicAggregationService academicService;

    public StudentProfileResponse getFullStudentDashboard(Long studentId) {
        var student = studentService.getById(studentId);

        return academicService.assembleStudentProfile(student);
    }
}