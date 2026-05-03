package com.uni.iam.dto.response;

import com.uni.iam.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO LAYER — Outbound
 * Full Teacher profile response — never exposes the password hash.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherResponse {

    private Long id;
    private String username;
    private String email;
    private Role role;
    private LocalDateTime createdAt;

    // Teacher-specific fields
    private String faculty;
    private String officeNumber;
    private String specialization;
}
