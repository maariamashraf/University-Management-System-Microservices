package com.uni.iam.service.interfaces;

import com.uni.iam.dto.response.TeacherResponse;

import java.util.List;

public interface TeacherService {

    List<TeacherResponse> getAllTeachers();
}
