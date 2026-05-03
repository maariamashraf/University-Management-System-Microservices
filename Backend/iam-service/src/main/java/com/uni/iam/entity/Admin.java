package com.uni.iam.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * ENTITY LAYER
 * Admin — extends User with admin-specific fields.
 * Maps to the "admins" table (JOINED strategy).
 */
@Entity
@Table(name = "admins")
@DiscriminatorValue("ADMIN")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Admin extends User {

    @Column(name = "admin_level")
    private String adminLevel;
}
