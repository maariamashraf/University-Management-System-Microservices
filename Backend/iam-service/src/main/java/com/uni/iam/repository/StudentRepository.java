package com.uni.iam.repository;

import com.uni.iam.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * REPOSITORY LAYER
 * Spring Data JPA repository for the Student entity.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {}
