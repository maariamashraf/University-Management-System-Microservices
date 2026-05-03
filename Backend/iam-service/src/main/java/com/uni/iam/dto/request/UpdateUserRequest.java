package com.uni.iam.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO LAYER — Inbound
 * Generic patch request for updating a user profile.
 * All fields are optional — only non-null values are applied.
 * Role changes are NOT allowed through this endpoint (security boundary).
 */
@Data
public class UpdateUserRequest {

    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @Email(message = "Invalid email format")
    private String email;

    // Student-specific (ignored for non-students)
    private Long depId;
    private Integer yearOfStudy;

    // Teacher-specific (ignored for non-teachers)
    private String officeNumber;
    private String specialization;
}
