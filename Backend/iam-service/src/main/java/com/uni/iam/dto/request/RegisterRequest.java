package com.uni.iam.dto.request;

import com.uni.iam.entity.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * DTO LAYER — Inbound
 * Carries registration data from the client to the service layer.
 * Validated before the service is ever called.
 */
@Data
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;   // STUDENT | TEACHER | ADMIN

    // Optional extra fields — used only when role = STUDENT
    private String studentNumber;
    private String department;
    private Integer yearOfStudy;

    // Optional extra fields — used only when role = TEACHER
    private String faculty;
    private String officeNumber;
    private String specialization;
}
