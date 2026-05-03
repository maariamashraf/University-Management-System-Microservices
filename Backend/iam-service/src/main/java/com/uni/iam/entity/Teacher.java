package com.uni.iam.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * ENTITY LAYER
 * Teacher — extends User with faculty-specific fields.
 * Maps to the "teachers" table (JOINED strategy).
 */
@Entity
@Table(name = "teachers")
@DiscriminatorValue("TEACHER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Teacher extends User {



    @Column(name = "office_number")
    private String officeNumber;

    @Column(name = "specialization")
    private String specialization;
}
