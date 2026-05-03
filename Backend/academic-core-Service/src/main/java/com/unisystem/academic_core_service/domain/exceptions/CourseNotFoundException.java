package com.unisystem.academic_core_service.domain.exceptions;

public class CourseNotFoundException extends RuntimeException {

    public CourseNotFoundException(Long courseId) {
        super("Course with ID " + courseId + " was not found");
    }

    public CourseNotFoundException(String message) {
        super(message);
    }
}
