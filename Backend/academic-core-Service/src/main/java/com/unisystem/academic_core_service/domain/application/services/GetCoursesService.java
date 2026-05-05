package com.unisystem.academic_core_service.domain.application.services;

import com.unisystem.academic_core_service.domain.application.port.in.GetCoursesQuery;
import com.unisystem.academic_core_service.domain.application.port.out.CourseRepositoryPort;
import com.unisystem.academic_core_service.domain.exceptions.CourseNotFoundException;
import com.unisystem.academic_core_service.domain.model.Course;


import java.util.List;
import java.util.Optional;

public class GetCoursesService implements GetCoursesQuery {

    private  final CourseRepositoryPort courseRepository;

    public GetCoursesService(CourseRepositoryPort courseRepository) {
        this.courseRepository = courseRepository;
    }


    @Override

    public List<Course> findAll() {
        return courseRepository.findAll();
    }

    @Override

    public Optional<Course> findById(Long courseId) {
       Course course = courseRepository.findById(courseId)
               .orElseThrow(() -> new CourseNotFoundException(courseId));

       return Optional.of(course);
    }

    @Override
    public List<Course> findByIds(List<Long> courseIds) {
        if (courseIds == null || courseIds.isEmpty()) {
            return List.of();
        }
        return courseRepository.findByIds(courseIds);
    }

    @Override

    public List<Course> findByTeacherName(String teacherName) {
        return courseRepository.findByTeacherName(teacherName);
    }

    @Override

    public List<Course> findByTeacherId(Long TeacherId) {
        return courseRepository.findByTeacherId(TeacherId);
    }

    @Override

    public Optional<Course> findByCourseName(String courseName) {
        return  courseRepository.findByCourseName(courseName);
    }

    @Override

    public List<Course> findByDepartmentName(String departmentName) {
        return   courseRepository.findByDepartmentName(departmentName);
    }

    @Override

    public List<Course> findPopular(int topN) {
        return courseRepository.findPopular(topN);
    }
}
