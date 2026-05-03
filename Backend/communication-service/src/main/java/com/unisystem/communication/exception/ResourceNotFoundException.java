package com.unisystem.communication.exception;

/**
 * SOLID — Single Responsibility: represents a "resource not found" error.
 * Thrown by the Service layer when an entity doesn't exist in the DB.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceName, Long id) {
        super(resourceName + " not found with ID: " + id);
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
