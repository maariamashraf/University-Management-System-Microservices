package com.unisystem.academic_core_service.domain.exceptions;

public class DuplicateCourseException extends RuntimeException {

    public DuplicateCourseException(String courseCode) {
        super("Course with code '" + courseCode + "' already exists");
    }
}
