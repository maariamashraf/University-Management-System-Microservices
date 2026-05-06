package com.unisystem.academic_core_service.infrastructure.aop.aspects;

import com.unisystem.academic_core_service.infrastructure.aop.annotations.AuditLog;
import com.unisystem.academic_core_service.infrastructure.audit.AuditLogRecordingService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@RequiredArgsConstructor
public class AuditLogAspect {

    private static final Logger log = LoggerFactory.getLogger(AuditLogAspect.class);

    private final AuditLogRecordingService auditLogRecordingService;

    @AfterReturning("@annotation(auditLog)")
    public void persistAudit(JoinPoint joinPoint, AuditLog auditLog) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            log.warn("AUDIT no request context; skipping persist for {}", joinPoint.getSignature().toShortString());
            return;
        }

        HttpServletRequest request = attributes.getRequest();
        String rawUserId = emptyToNull(request.getHeader("X-User-Id"));
        String username = emptyToNull(request.getHeader("X-Username"));
        String normalizedRole = normalizeRole(request.getHeader("X-Roles"));
        Long userId = parseUserId(rawUserId);

        String action = auditLog.action().isEmpty() ? joinPoint.getSignature().getName() : auditLog.action();

        String details = request.getMethod() + " " + request.getRequestURI();
        String ip = request.getRemoteAddr();

        log.info(
                "AUDIT LOG - Timestamp: {}, UserID: {}, Username: {}, Role: {}, Action: {}, Method: {}",
                java.time.LocalDateTime.now(),
                rawUserId,
                username,
                normalizedRole,
                action,
                joinPoint.getSignature().toShortString());

        auditLogRecordingService.record(userId, username, normalizedRole, action, details, ip);
    }

    private static String emptyToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private static Long parseUserId(String raw) {
        if (raw == null) {
            return null;
        }
        try {
            return Long.parseLong(raw);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    /**
     * Gateway forwards JWT roles as Java list string, e.g. {@code [ROLE_STUDENT]}.
     */
    private static String normalizeRole(String xRoles) {
        if (xRoles == null || xRoles.isBlank()) {
            return null;
        }
        String trimmed = xRoles.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            trimmed = trimmed.substring(1, trimmed.length() - 1);
        }
        for (String part : trimmed.split(",")) {
            String token = part.trim();
            if (token.contains("ROLE_ADMIN")) {
                return "ADMIN";
            }
        }
        for (String part : trimmed.split(",")) {
            String token = part.trim();
            if (token.contains("ROLE_TEACHER")) {
                return "TEACHER";
            }
        }
        for (String part : trimmed.split(",")) {
            String token = part.trim();
            if (token.contains("ROLE_STUDENT")) {
                return "STUDENT";
            }
        }
        return null;
    }
}
