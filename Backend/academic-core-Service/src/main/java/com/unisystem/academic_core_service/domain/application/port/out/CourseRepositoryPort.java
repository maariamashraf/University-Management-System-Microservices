package com.unisystem.academic_core_service.domain.application.port.out;

import com.unisystem.academic_core_service.domain.model.Course;

import java.util.List;
import java.util.Optional;

public interface CourseRepositoryPort {
    Course save(Course course);
    Optional<Course> findById(Long id);
    List<Course> findAll();
    List<Course> findPopular(int topN);
    void deleteById(Long id);
    boolean existsByCourseCode(String courseCode);
    List<Course> findByTeacherName(String teacherName);
    List<Course> findByTeacherId(Long TeacherId);
    Optional<Course> findByCourseName(String courseName);
    List<Course> findByDepartmentName(String departmentName);

}
