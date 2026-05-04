package com.uni.iam.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * ENTITY LAYER
 * Student — extends User with academic-specific fields.
 * Maps to the "students" table (JOINED strategy).
 */
@Entity
@Table(name = "students")
@PrimaryKeyJoinColumn(name = "id", referencedColumnName = "id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(callSuper = true)
public class Student extends User {

    @Column(name = "gpa", precision = 3, scale = 2)
    private BigDecimal gpa;

    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;

    @Column(name = "total_credits")
    private Integer totalCredits;
}
