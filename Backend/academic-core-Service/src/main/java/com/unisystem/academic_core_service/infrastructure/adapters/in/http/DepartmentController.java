package com.unisystem.academic_core_service.infrastructure.adapters.in.http;

import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.DepartmentEntity;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.repository.DepartmentJpaRepository;
import com.unisystem.academic_core_service.domain.model.ValueObjects.DepartmentsType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentJpaRepository departmentJpaRepository;

    @PostMapping("/create")
    public ResponseEntity<DepartmentEntity> create(@RequestBody CreateDepartmentRequest request) {
        DepartmentEntity department = new DepartmentEntity();
        department.setId(request.id());
        department.setName(normalizeDepartmentName(request.name()));
        DepartmentEntity saved = departmentJpaRepository.save(department);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    public ResponseEntity<List<DepartmentEntity>> getAll() {
        return ResponseEntity.ok(departmentJpaRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentEntity> getById(@PathVariable Long id) {
        DepartmentEntity department = departmentJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        return ResponseEntity.ok(department);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<List<DepartmentEntity>> getByName(@PathVariable String name) {
        return ResponseEntity.ok(departmentJpaRepository.findByNameIgnoreCase(name));
    }



    private String normalizeDepartmentName(String name) {
        String normalized = name.trim().replace(' ', '_');
        try {
            return DepartmentsType.valueOf(normalized).name();
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Invalid department name: " + name);
        }
    }

    public record CreateDepartmentRequest(Long id, String name) {
    }
}
