package com.uni.iam.service.interfaces;

import com.uni.iam.dto.response.StudentResponse;
import com.uni.iam.dto.response.StudentProfileResponse;

import java.util.List;

public interface StudentService {

    List<StudentResponse> getAllStudents();

    StudentProfileResponse getStudentDetails(Long id);
}
