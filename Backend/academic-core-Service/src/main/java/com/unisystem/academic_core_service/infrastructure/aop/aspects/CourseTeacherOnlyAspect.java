package com.unisystem.academic_core_service.infrastructure.aop.aspects;

import com.unisystem.academic_core_service.infrastructure.aop.annotations.CourseTeacherOnly;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class CourseTeacherOnlyAspect {

    @Before("@annotation(courseTeacherOnly)")
    public void checkCourseTeacher(CourseTeacherOnly courseTeacherOnly) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            throw new RuntimeException("No active request found");
        }

        HttpServletRequest request = attributes.getRequest();
        String userId = request.getHeader("X-User-Id");
        String roles = request.getHeader("X-Roles");

        if (userId == null || roles == null || (!roles.contains("TEACHER") && !roles.contains("ROLE_TEACHER"))) {
            throw new RuntimeException("Access Denied: Only the assigned teacher can execute this method.");
        }
        
        // Note: Further implementation would require fetching the course 
        // and comparing its teacherId with the X-User-Id header.
    }
}
