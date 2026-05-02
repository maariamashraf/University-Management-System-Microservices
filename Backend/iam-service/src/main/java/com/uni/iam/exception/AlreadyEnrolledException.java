package com.uni.iam.exception;

/**
 * EXCEPTION LAYER
 * Thrown when trying to enroll a user in a course they are already enrolled in.
 * Maps to HTTP 409 Conflict via GlobalExceptionHandler.
 */
public class AlreadyEnrolledException extends RuntimeException {

    public AlreadyEnrolledException(Long userId, Long courseId) {
        super("User " + userId + " is already enrolled in course " + courseId);
    }
}
