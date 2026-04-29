package com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.mapper;

import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.CourseEntity;
import com.unisystem.academic_core_service.domain.model.Course;
import org.springframework.stereotype.Component;

@Component
public class CoursePersistenceMapper {

    public CourseEntity toEntity(Course course) {
        CourseEntity entity = new CourseEntity();
        entity.setId(course.getId());
        entity.setName(course.getName());
        entity.setCourseCode(course.getCourseCode());
        entity.setDescription(course.getDescription());
        entity.setStartDate(course.getStartDate());
        entity.setEndDate(course.getEndDate());
        entity.setCredits(course.getCredits());
        entity.setMaxStudents(course.getMaxStudents());
        entity.setEnrolledCount(course.getEnrolledCount());
        entity.setDepartmentId(course.getDepartmentId());
        entity.setTeacherId(course.getTeacherId());
        return entity;
    }

    public Course toDomain(CourseEntity entity) {
        Course course = new Course();
        course.setId(entity.getId());
        course.setName(entity.getName());
        course.setCourseCode(entity.getCourseCode());
        course.setDescription(entity.getDescription());
        course.setStartDate(entity.getStartDate());
        course.setEndDate(entity.getEndDate());
        course.setCredits(entity.getCredits());
        course.setMaxStudents(entity.getMaxStudents());
        course.setEnrolledCount(entity.getEnrolledCount());
        course.setDepartmentId(entity.getDepartmentId());
        course.setTeacherId(entity.getTeacherId());
        return course;
    }
}
