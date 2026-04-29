package com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.repository;

import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.DepartmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentJpaRepository extends JpaRepository<DepartmentEntity, Long> {
    List<DepartmentEntity> findByNameIgnoreCase(String name);
}
