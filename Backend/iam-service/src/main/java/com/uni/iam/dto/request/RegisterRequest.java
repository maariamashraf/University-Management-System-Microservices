package com.uni.iam.dto.request;

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

    private String teacherCode;
}
