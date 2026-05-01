package com.uni.iam.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO LAYER — Inbound
 * Carries login credentials from the client.
 */
@Data
public class LoginRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}
