package com.unisystem.academic_core_service.infrastructure.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class AuthFiltter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String userId = emptyToNull(request.getHeader("X-User-Id"));
        String xRoles = emptyToNull(request.getHeader("X-Roles"));

        if (userId != null && xRoles != null) {
            List<SimpleGrantedAuthority> authorities = parseAuthorities(xRoles);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userId, null,
                    authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private static String emptyToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private static List<SimpleGrantedAuthority> parseAuthorities(String xRoles) {
        String trimmed = xRoles.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            trimmed = trimmed.substring(1, trimmed.length() - 1);
        }
        if (trimmed.isEmpty()) {
            return List.of();
        }
        return Arrays.stream(trimmed.split(","))
                .map(String::trim)
                .filter(part -> !part.isEmpty())
                .map(SimpleGrantedAuthority::new)
                .toList();
    }
}
