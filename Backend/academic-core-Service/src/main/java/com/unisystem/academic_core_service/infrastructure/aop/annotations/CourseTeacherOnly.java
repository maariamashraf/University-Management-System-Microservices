package com.unisystem.academic_core_service.infrastructure.aop.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Restricts a method so only the instructor assigned to the course may execute it
 * ({@code course.teacherId} must match authenticated {@code X-User-Id}).
 * {@code ROLE_ADMIN} / ADMIN in {@code X-Roles} skips the ownership check.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface CourseTeacherOnly {

    /**
     * Name of a controller method parameter that holds the course id directly
     * (e.g. path variable {@code courseId}, or {@code id} for GET /courses/{id}).
     */
    String param() default "courseId";

    /**
     * If set (e.g. {@code request}), the course id is read from this request-body parameter
     * using {@link #bodyField()} as the accessor (Java record/component or getter name).
     */
    String bodyParam() default "";

    /**
     * When using {@link #bodyParam()}, name of record accessor / JavaBean property for course id ({@code courseId} → {@code courseId()}).
     */
    String bodyField() default "courseId";
}
