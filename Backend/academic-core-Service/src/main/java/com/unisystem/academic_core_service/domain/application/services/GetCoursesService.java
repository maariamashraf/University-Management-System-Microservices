package com.unisystem.academic_core_service.domain.application.services;

import com.unisystem.academic_core_service.domain.application.port.in.GetCoursesQuery;
import com.unisystem.academic_core_service.domain.application.port.out.CourseRepositoryPort;
import com.unisystem.academic_core_service.domain.exceptions.CourseNotFoundException;
import com.unisystem.academic_core_service.domain.model.Course;
import com.unisystem.academic_core_service.infrastructure.config.CacheConfig;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;
import java.util.Optional;

public class GetCoursesService implements GetCoursesQuery {

    private  final CourseRepositoryPort courseRepository;

    public GetCoursesService(CourseRepositoryPort courseRepository) {
        this.courseRepository = courseRepository;
    }


    @Override
    @Cacheable(cacheNames = CacheConfig.COURSES_ALL_CACHE)
    public List<Course> findAll() {
        return courseRepository.findAll();
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.COURSES_BY_ID_CACHE, key = "#courseId")
    public Optional<Course> findById(Long courseId) {
       Course course = courseRepository.findById(courseId)
               .orElseThrow(() -> new CourseNotFoundException(courseId));

       return Optional.of(course);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.COURSES_BY_TEACHER_NAME_CACHE, key = "#teacherName")
    public List<Course> findByTeacherName(String teacherName) {
        return courseRepository.findByTeacherName(teacherName);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.COURSES_BY_TEACHER_ID_CACHE, key = "#TeacherId")
    public List<Course> findByTeacherId(Long TeacherId) {
        return courseRepository.findByTeacherId(TeacherId);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.COURSES_BY_NAME_CACHE, key = "#courseName")
    public Optional<Course> findByCourseName(String courseName) {
        return  courseRepository.findByCourseName(courseName);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.COURSES_BY_DEPARTMENT_CACHE, key = "#departmentName")
    public List<Course> findByDepartmentName(String departmentName) {
        return   courseRepository.findByDepartmentName(departmentName);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.COURSES_POPULAR_CACHE, key = "#topN")
    public List<Course> findPopular(int topN) {
        return courseRepository.findPopular(topN);
    }
}
