package com.uni.iam.dto.response;

import com.uni.iam.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO LAYER — Outbound
 * Returned to the caller after a successful login or registration.
 * Contains the JWT and basic profile info.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private Long userId;
    private String username;
}
