package com.uni.iam.dto.response;

import com.uni.iam.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    // Student-specific fields
    private String studentNumber;
    private Long depId;
    private Integer yearOfStudy;
}
