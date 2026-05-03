package com.uni.iam.repository;

import com.uni.iam.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * REPOSITORY LAYER
 * Spring Data JPA repository for the Student entity.
 * Adds student-specific query methods on top of JpaRepository.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findByDepId(Long depId);

    List<Student> findByYearOfStudy(Integer yearOfStudy);

    Optional<Student> findByStudentNumber(String studentNumber);

    List<Student> findByDepIdAndYearOfStudy(Long depId, Integer yearOfStudy);
}
