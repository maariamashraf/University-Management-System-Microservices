package com.uni.iam.exception;

/**
 * User requested by username does not exist. Maps to 404 via {@link UserNotFoundException} handler.
 */
public class UserNotFoundByUsernameException extends UserNotFoundException {

    public UserNotFoundByUsernameException(String username) {
        super("User not found with username: " + username);
    }
}
