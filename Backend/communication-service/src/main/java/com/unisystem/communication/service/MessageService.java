package com.unisystem.communication.service;

import com.unisystem.communication.persistence.dto.message.MessageRequest;
import com.unisystem.communication.persistence.dto.message.MessageResponse;

import java.util.List;

/**
 * SOLID — Interface Segregation + Dependency Inversion:
 * Controllers and WebSocket handlers depend on this abstraction.
 */
public interface MessageService {

    // ── Write Operations ──────────────────────────────────
    void createMessage(MessageRequest messageRequest);
    void deleteMessageById(Long messageId);

    // ── Read Operations ───────────────────────────────────
    List<MessageResponse> getMessagesByCourseId(Long courseId);
    List<MessageResponse> getMessagesBySenderId(Long senderId);
    long countMessagesByCourseId(Long courseId);
}
