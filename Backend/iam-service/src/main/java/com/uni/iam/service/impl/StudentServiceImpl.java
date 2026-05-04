package com.uni.iam.service.impl;

import com.uni.iam.dto.response.StudentResponse;
import com.uni.iam.entity.Student;
import com.uni.iam.repository.StudentRepository;
import com.uni.iam.service.interfaces.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream().map(this::toStudentResponse).toList();
    }

    private StudentResponse toStudentResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .username(student.getUsername())
                .email(student.getEmail())
                .role(student.getRole())
                .createdAt(student.getCreatedAt())
                .gpa(student.getGpa())
                .enrollmentDate(student.getEnrollmentDate())
                .totalCredits(student.getTotalCredits())
                .build();
    }
}
