package com.unisystem.academic_core_service.infrastructure.aop.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Restricts a method so only users with the TEACHER role can execute it.
 * Applied on controller methods that create, update, or delete academic resources.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface TeachersOnly {
}
