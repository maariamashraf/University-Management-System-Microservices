package com.uni.iam.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * ENTITY LAYER
 * Student — extends User with academic-specific fields.
 * Maps to the "students" table (JOINED strategy).
 */
@Entity
@Table(name = "students")
@DiscriminatorValue("STUDENT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Student extends User {

    @Column(name = "student_number", unique = true)
    private String studentNumber;

    @Column(name = "department")
    private String department;

    @Column(name = "year_of_study")
    private Integer yearOfStudy;
}
