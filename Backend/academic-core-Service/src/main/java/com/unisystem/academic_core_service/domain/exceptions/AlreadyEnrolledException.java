package com.unisystem.academic_core_service.domain.exceptions;

public class AlreadyEnrolledException extends  RuntimeException {

    public AlreadyEnrolledException(Long sutdentId, Long courseId) {
        super("Student with ID " + sutdentId + " is already enrolled in course with ID " + courseId);
    }
}
