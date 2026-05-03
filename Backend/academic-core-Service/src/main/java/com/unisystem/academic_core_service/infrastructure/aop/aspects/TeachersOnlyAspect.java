package com.unisystem.academic_core_service.infrastructure.aop.aspects;

import com.unisystem.academic_core_service.infrastructure.aop.annotations.TeachersOnly;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@Order(1)
public class TeachersOnlyAspect {

    @Before("@annotation(teachersOnly)")
    public void checkTeacherRole(TeachersOnly teachersOnly) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            throw new RuntimeException("No active request found");
        }

        HttpServletRequest request = attributes.getRequest();
        String roles = request.getHeader("X-Roles");

        if (roles == null
                || (!roles.contains("TEACHER") )
                    && !roles.contains("ADMIN") ) {
            throw new RuntimeException("Access Denied: Only users with TEACHER or ADMIN role can execute this method.");
        }
    }
}
