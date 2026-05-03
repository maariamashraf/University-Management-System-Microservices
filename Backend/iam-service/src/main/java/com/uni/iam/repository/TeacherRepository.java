package com.uni.iam.repository;

import com.uni.iam.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * REPOSITORY LAYER
 * Spring Data JPA repository for the Teacher entity.
 * Adds teacher-specific query methods on top of JpaRepository.
 */
@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    List<Teacher> findByFaculty(String faculty);

    List<Teacher> findBySpecialization(String specialization);

    List<Teacher> findByFacultyAndSpecialization(String faculty, String specialization);
}
