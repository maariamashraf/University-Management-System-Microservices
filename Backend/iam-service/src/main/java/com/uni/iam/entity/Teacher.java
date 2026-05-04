package com.uni.iam.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

/**
 * ENTITY LAYER
 * Teacher — extends User with faculty-specific fields.
 * Maps to the "teachers" table (JOINED strategy).
 */
@Entity
@Table(name = "teachers")
@PrimaryKeyJoinColumn(name = "id", referencedColumnName = "id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(callSuper = true)
public class Teacher extends User {

    @Column(name = "office_location")
    private String officeLocation;

    @Column(name = "salary", precision = 10, scale = 2)
    private BigDecimal salary;
}
