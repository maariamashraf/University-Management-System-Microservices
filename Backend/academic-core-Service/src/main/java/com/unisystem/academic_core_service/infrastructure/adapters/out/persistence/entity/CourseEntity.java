package com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "courses")
@Getter
@Setter
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "course_code", nullable = false, unique = true)
    private String courseCode;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(nullable = false)
    private int credits;

    @Column(name = "max_students", nullable = false)
    private int maxStudents;

    @Column(name = "enrolled_count", nullable = false)
    private int enrolledCount;

    @Column(name = "department_id", nullable = false)
    private Long departmentId;

    @Column(name = "teacher_id", nullable = false)
    private Long teacherId;
}
