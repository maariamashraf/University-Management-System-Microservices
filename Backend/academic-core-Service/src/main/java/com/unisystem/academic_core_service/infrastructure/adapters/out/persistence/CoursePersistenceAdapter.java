package com.unisystem.academic_core_service.infrastructure.adapters.out.persistence;

import com.unisystem.academic_core_service.domain.application.port.out.CourseRepositoryPort;
import com.unisystem.academic_core_service.domain.model.Course;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.CourseEntity;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.DepartmentEntity;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.mapper.CoursePersistenceMapper;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.repository.CourseJpaRepository;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.repository.DepartmentJpaRepository;
import com.unisystem.academic_core_service.infrastructure.config.CacheConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
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
    @Caching(evict = {
            @CacheEvict(cacheNames = CacheConfig.COURSES_ALL_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.COURSES_BY_ID_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.COURSES_BY_TEACHER_NAME_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.COURSES_BY_TEACHER_ID_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.COURSES_BY_NAME_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.COURSES_BY_DEPARTMENT_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.COURSES_POPULAR_CACHE, allEntries = true)
    })
    public Course save(Course course) {
        CourseEntity saved = courseJpaRepository.save(coursePersistenceMapper.toEntity(course));
        return coursePersistenceMapper.toDomain(saved);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.COURSES_BY_ID_CACHE, key = "#id")
    public Optional<Course> findById(Long id) {
        return courseJpaRepository.findById(id).map(coursePersistenceMapper::toDomain);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.COURSES_ALL_CACHE)
    public List<Course> findAll() {
        return courseJpaRepository.findAll().stream().map(coursePersistenceMapper::toDomain).toList();
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.COURSES_POPULAR_CACHE, key = "#topN")
    public List<Course> findPopular(int topN) {
        return courseJpaRepository.findAllByOrderByEnrolledCountDesc(PageRequest.of(0, topN))
                .stream()
                .map(coursePersistenceMapper::toDomain)
                .toList();
    }

    @Override
    @Caching(evict = {
            @CacheEvict(cacheNames = CacheConfig.COURSES_ALL_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.COURSES_BY_ID_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.COURSES_POPULAR_CACHE, allEntries = true)
    })
    public void deleteById(Long id) {
        courseJpaRepository.deleteById(id);
    }

    @Override
    public boolean existsByCourseCode(String courseCode) {
        return courseJpaRepository.existsByCourseCode(courseCode);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.COURSES_BY_TEACHER_NAME_CACHE, key = "#teacherName")
    public List<Course> findByTeacherName(String teacherName) {
        // Teacher names are owned by another service, so this service only persists teacherId.
        return Collections.emptyList();
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.COURSES_BY_TEACHER_ID_CACHE, key = "#teacherId")
    public List<Course> findByTeacherId(Long teacherId) {
        return courseJpaRepository.findByTeacherId(teacherId).stream().map(coursePersistenceMapper::toDomain).toList();
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.COURSES_BY_NAME_CACHE, key = "#courseName")
    public Optional<Course> findByCourseName(String courseName) {
        return courseJpaRepository.findByNameIgnoreCase(courseName).map(coursePersistenceMapper::toDomain);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.COURSES_BY_DEPARTMENT_CACHE, key = "#departmentName")
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
