package com.unisystem.academic_core_service.domain.application.port.in;

import com.unisystem.academic_core_service.domain.model.Course;

import java.util.List;
import java.util.Optional;

public interface GetCoursesQuery {
    List<Course> findAll();
    Optional<Course> findById(Long courseId);
    List<Course> findByTeacherName(String teacherName);
    List<Course> findByTeacherId(Long TeacherId);
    Optional<Course> findByCourseName(String courseName);
    List<Course> findByDepartmentName(String departmentName);
    List<Course> findPopular(int topN);
}
