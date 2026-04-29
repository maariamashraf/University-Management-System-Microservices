package com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "departments")
@Getter
@Setter
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentEntity {

    @Id
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}
