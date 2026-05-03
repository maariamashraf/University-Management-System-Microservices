package com.unisystem.academic_core_service.infrastructure.aop.aspects;

import com.unisystem.academic_core_service.infrastructure.aop.annotations.AuditLog;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;

@Aspect
@Component
public class AuditLogAspect {

    private static final Logger log = LoggerFactory.getLogger(AuditLogAspect.class);

    @Before("@annotation(auditLog)")
    public void logAudit(JoinPoint joinPoint, AuditLog auditLog) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        String userId = "UNKNOWN";
        String username = "UNKNOWN";

        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            userId = request.getHeader("X-User-Id");
            username = request.getHeader("X-Username");
        }

        String action = auditLog.action().isEmpty() ? joinPoint.getSignature().getName() : auditLog.action();
        
        log.info("AUDIT LOG - Timestamp: {}, UserID: {}, Username: {}, Action: {}, Method: {}",
                LocalDateTime.now(),
                userId,
                username,
                action,
                joinPoint.getSignature().toShortString());
    }
}
