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
        // English comment: Step 1: Get basic info from our core service
        var student = studentService.getById(studentId);

        // English comment: Step 2: Orchestrate the complex data gathering
        return academicService.assembleStudentProfile(student);
    }
}