package com.uni.iam.dto.response;

import com.uni.iam.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO LAYER — Outbound
 * Full Student profile response — never exposes the password hash.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {

    private Long id;
    private String username;
    private String email;
    private Role role;
    private LocalDateTime createdAt;

    private BigDecimal gpa;
    private LocalDate enrollmentDate;
    private Integer totalCredits;
}
