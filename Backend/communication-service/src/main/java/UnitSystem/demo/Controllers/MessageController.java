package UnitSystem.demo.Controllers;

import UnitSystem.demo.BusinessLogic.InterfaceServiceLayer.MessageService;
import UnitSystem.demo.DataAccessLayer.Dto.Message.MessageRequest;
import UnitSystem.demo.DataAccessLayer.Dto.Message.MessageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * SOLID — Single Responsibility: only handles HTTP routing for messages.
 * SOLID — Dependency Inversion: depends on MessageService interface.
 *
 * Layered Architecture: Controller layer — receives HTTP/WebSocket, delegates to Service.
 */
@RestController
@RequestMapping("/api/messages")
@Tag(name = "Message", description = "Endpoints for course chat message management")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    // ── WebSocket handler (STOMP) ──────────────────────────
    // Frontend sends to: /app/course/{courseId}
    // Message is saved to DB and broadcasted to: /topic/course/{courseId}
    @Operation(summary = "Send a message in a course chat via WebSocket with broadcasting to all course members")
    @MessageMapping("/course/{courseId}")
    public void sendMessageViaWebSocket(MessageRequest messageRequest) {
        messageService.createMessage(messageRequest);
    }

    // ── REST CREATE ────────────────────────────────────────

    @Operation(summary = "Send a message in a course chat via REST (also broadcasts via WebSocket)")
    @PostMapping
    public ResponseEntity<Void> createMessage(@Valid @RequestBody MessageRequest messageRequest) {
        messageService.createMessage(messageRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // ── REST READ ──────────────────────────────────────────

    @Operation(summary = "Get all messages for a course (ordered by time ascending)")
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<MessageResponse>> getMessagesByCourseId(@PathVariable Long courseId) {
        return ResponseEntity.ok(messageService.getMessagesByCourseId(courseId));
    }

    @Operation(summary = "Get all messages sent by a specific user")
    @GetMapping("/sender/{senderId}")
    public ResponseEntity<List<MessageResponse>> getMessagesBySenderId(@PathVariable Long senderId) {
        return ResponseEntity.ok(messageService.getMessagesBySenderId(senderId));
    }

    @Operation(summary = "Count total messages in a course")
    @GetMapping("/course/{courseId}/count")
    public ResponseEntity<Long> countMessagesByCourseId(@PathVariable Long courseId) {
        return ResponseEntity.ok(messageService.countMessagesByCourseId(courseId));
    }

    // ── REST DELETE ────────────────────────────────────────

    @Operation(summary = "Delete a message by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessageById(@PathVariable Long id) {
        messageService.deleteMessageById(id);
        return ResponseEntity.noContent().build();
    }
}
