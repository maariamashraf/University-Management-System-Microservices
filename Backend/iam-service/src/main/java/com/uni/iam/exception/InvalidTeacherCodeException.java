package com.uni.iam.exception;

public class InvalidTeacherCodeException extends RuntimeException {

    public InvalidTeacherCodeException() {
        super("Invalid teacher code");
    }
}
