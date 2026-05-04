package com.uni.iam.service.impl;

import com.uni.iam.dto.response.TeacherResponse;
import com.uni.iam.entity.Teacher;
import com.uni.iam.repository.TeacherRepository;
import com.uni.iam.service.interfaces.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TeacherResponse> getAllTeachers() {
        return teacherRepository.findAll().stream().map(this::toTeacherResponse).toList();
    }

    private TeacherResponse toTeacherResponse(Teacher teacher) {
        return TeacherResponse.builder()
                .id(teacher.getId())
                .username(teacher.getUsername())
                .email(teacher.getEmail())
                .role(teacher.getRole())
                .createdAt(teacher.getCreatedAt())
                .officeLocation(teacher.getOfficeLocation())
                .salary(teacher.getSalary())
                .build();
    }
}
