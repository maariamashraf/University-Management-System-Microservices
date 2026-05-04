package com.uni.iam.repository;

import com.uni.iam.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * REPOSITORY LAYER
 * Spring Data JPA repository for the Teacher entity.
 */
@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {}
