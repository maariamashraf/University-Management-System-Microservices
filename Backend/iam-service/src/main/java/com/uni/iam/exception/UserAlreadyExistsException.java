package com.uni.iam.exception;

/**
 * Thrown by AuthService when a registration attempt uses a
 * username or email that already exists in the database.
 */
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
