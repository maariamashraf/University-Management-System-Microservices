package com.uni.iam.service.interfaces;

import com.uni.iam.dto.response.StudentResponse;
import com.uni.iam.dto.response.StudentProfileResponse;
import com.uni.iam.entity.Student;

import java.util.List;

public interface StudentService {

    List<StudentResponse> getAllStudents();
    Student getById(Long id);
    String getStudneName(Long id);
}
