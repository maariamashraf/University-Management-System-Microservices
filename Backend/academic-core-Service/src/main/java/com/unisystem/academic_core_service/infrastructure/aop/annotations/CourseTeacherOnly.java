package com.unisystem.academic_core_service.infrastructure.aop.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Restricts a method so only the specific teacher of the course can execute it.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface CourseTeacherOnly {
}
