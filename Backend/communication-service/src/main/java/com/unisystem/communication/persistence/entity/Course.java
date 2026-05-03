package com.unisystem.communication.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Stub — the real Course entity lives in the Academic Core service.
 * Maps to the shared "courses" table for JPA relationship resolution only.
 * Read-only from this service's perspective.
 */
@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_name")
    private String name;

    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<EnrolledCourse> courseEnrollments = new HashSet<>();
}
