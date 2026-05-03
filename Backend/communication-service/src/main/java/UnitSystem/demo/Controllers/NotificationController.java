package UnitSystem.demo.Controllers;

import UnitSystem.demo.BusinessLogic.InterfaceServiceLayer.NotificationService;
import UnitSystem.demo.DataAccessLayer.Dto.Notification.Course.NotificationCourseRequest;
import UnitSystem.demo.DataAccessLayer.Dto.Notification.User.NotificationRequest;
import UnitSystem.demo.DataAccessLayer.Dto.Notification.User.NotificationResponse;
import UnitSystem.demo.DataAccessLayer.Entities.NotificationType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * SOLID — Single Responsibility: only handles HTTP routing for notifications.
 * SOLID — Dependency Inversion: depends on NotificationService interface,
 *         not on the concrete implementation.
 *
 * Layered Architecture: Controller layer — receives HTTP, delegates to Service.
 */
@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notification", description = "Endpoints for notification management")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // ── CREATE ─────────────────────────────────────────────

    @Operation(summary = "Create a new notification")
    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(
            @Valid @RequestBody NotificationRequest notificationRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(notificationService.createNotification(notificationRequest));
    }

    @Operation(summary = "Send a notification to a specific user (saves + WebSocket push)")
    @PostMapping("/user/send")
    public ResponseEntity<Void> sendNotificationToUser(
            @Valid @RequestBody NotificationRequest notificationRequest) {
        notificationService.sendNotificationToUser(notificationRequest);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Send a notification to all enrolled students in a course (saves + WebSocket push)")
    @PostMapping("/course")
    public ResponseEntity<Void> sendNotificationToCourse(
            @Valid @RequestBody NotificationCourseRequest notificationRequest) {
        notificationService.sendNotificationToCourse(notificationRequest);
        return ResponseEntity.ok().build();
    }

    // ── READ ───────────────────────────────────────────────

    @Operation(summary = "Get a notification by ID")
    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponse> getNotificationById(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.getNotificationById(id));
    }

    @Operation(summary = "Get all notifications for a user (newest first)")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getAllNotificationsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getAllNotificationsForUser(userId));
    }

    @Operation(summary = "Get unread notifications for a user")
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotificationsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotificationsForUser(userId));
    }

    @Operation(summary = "Count unread notifications for a user (for badge in UI)")
    @GetMapping("/user/{userId}/unread/count")
    public ResponseEntity<Long> countUnreadForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.countUnreadForUser(userId));
    }

    @Operation(summary = "Get notifications for a user filtered by type")
    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByType(
            @PathVariable Long userId,
            @PathVariable NotificationType type) {
        return ResponseEntity.ok(notificationService.getNotificationsByType(userId, type));
    }

    // ── UPDATE ─────────────────────────────────────────────

    @Operation(summary = "Mark a single notification as read")
    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @Operation(summary = "Mark all notifications as read for a user")
    @PatchMapping("/user/{userId}/read-all")
    public ResponseEntity<Integer> markAllAsReadForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.markAllAsReadForUser(userId));
    }

    // ── DELETE ─────────────────────────────────────────────

    @Operation(summary = "Delete a notification by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotificationById(@PathVariable Long id) {
        notificationService.deleteNotificationById(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Delete all notifications for a user")
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteAllNotificationsForUser(@PathVariable Long userId) {
        notificationService.deleteAllNotificationsForUser(userId);
        return ResponseEntity.noContent().build();
    }
}
