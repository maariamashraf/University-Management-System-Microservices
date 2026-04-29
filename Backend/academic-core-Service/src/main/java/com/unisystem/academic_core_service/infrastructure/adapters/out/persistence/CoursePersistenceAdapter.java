package com.unisystem.academic_core_service.infrastructure.adapters.out.persistence;

import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.CourseEntity;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.DepartmentEntity;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.mapper.CoursePersistenceMapper;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.repository.CourseJpaRepository;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.repository.DepartmentJpaRepository;
import com.unisystem.academic_core_service.domain.application.port.out.CourseRepositoryPort;
import com.unisystem.academic_core_service.domain.model.Course;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CoursePersistenceAdapter implements CourseRepositoryPort {

    private final CourseJpaRepository courseJpaRepository;
    private final DepartmentJpaRepository departmentJpaRepository;
    private final CoursePersistenceMapper coursePersistenceMapper;

    @Override
    public Course save(Course course) {
        CourseEntity saved = courseJpaRepository.save(coursePersistenceMapper.toEntity(course));
        return coursePersistenceMapper.toDomain(saved);
    }

    @Override
    public Optional<Course> findById(Long id) {
        return courseJpaRepository.findById(id).map(coursePersistenceMapper::toDomain);
    }

    @Override
    public List<Course> findAll() {
        return courseJpaRepository.findAll().stream().map(coursePersistenceMapper::toDomain).toList();
    }

    @Override
    public List<Course> findPopular(int topN) {
        return courseJpaRepository.findAllByOrderByEnrolledCountDesc(PageRequest.of(0, topN))
                .stream()
                .map(coursePersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public void deleteById(Long id) {
        courseJpaRepository.deleteById(id);
    }

    @Override
    public boolean existsByCourseCode(String courseCode) {
        return courseJpaRepository.existsByCourseCode(courseCode);
    }

    @Override
    public List<Course> findByTeacherName(String teacherName) {
        // Teacher names are owned by another service, so this service only persists teacherId.
        return Collections.emptyList();
    }

    @Override
    public List<Course> findByTeacherId(Long teacherId) {
        return courseJpaRepository.findByTeacherId(teacherId).stream().map(coursePersistenceMapper::toDomain).toList();
    }

    @Override
    public Optional<Course> findByCourseName(String courseName) {
        return courseJpaRepository.findByNameIgnoreCase(courseName).map(coursePersistenceMapper::toDomain);
    }

    @Override
    public List<Course> findByDepartmentName(String departmentName) {
        List<Long> departmentIds = departmentJpaRepository.findByNameIgnoreCase(departmentName)
                .stream()
                .map(DepartmentEntity::getId)
                .toList();

        if (departmentIds.isEmpty()) {
            return Collections.emptyList();
        }
        return courseJpaRepository.findByDepartmentIdIn(departmentIds).stream().map(coursePersistenceMapper::toDomain).toList();
    }
}
