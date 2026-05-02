package UnitSystem.demo.BusinessLogic.InterfaceServiceLayer;

import UnitSystem.demo.DataAccessLayer.Dto.Message.MessageRequest;
import UnitSystem.demo.DataAccessLayer.Dto.Message.MessageResponse;

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
