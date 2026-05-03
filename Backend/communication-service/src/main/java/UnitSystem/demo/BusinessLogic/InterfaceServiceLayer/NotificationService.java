package UnitSystem.demo.BusinessLogic.InterfaceServiceLayer;

import UnitSystem.demo.DataAccessLayer.Dto.Notification.Course.NotificationCourseRequest;
import UnitSystem.demo.DataAccessLayer.Dto.Notification.User.NotificationRequest;
import UnitSystem.demo.DataAccessLayer.Dto.Notification.User.NotificationResponse;
import UnitSystem.demo.DataAccessLayer.Entities.NotificationType;

import java.util.List;

/**
 * SOLID — Interface Segregation + Dependency Inversion:
 * Controllers and Kafka consumers depend on this abstraction,
 * not on the concrete implementation.
 */
public interface NotificationService {

    // ── Write Operations ──────────────────────────────────
    NotificationResponse createNotification(NotificationRequest notificationRequest);
    NotificationResponse markAsRead(Long notificationId);
    int markAllAsReadForUser(Long userId);
    void deleteNotificationById(Long notificationId);
    void deleteAllNotificationsForUser(Long userId);

    // ── WebSocket Push Operations ─────────────────────────
    void sendNotificationToUser(NotificationRequest notificationRequest);
    void sendNotificationToCourse(NotificationCourseRequest notificationRequest);

    // ── Read Operations ───────────────────────────────────
    NotificationResponse getNotificationById(Long notificationId);
    List<NotificationResponse> getAllNotificationsForUser(Long userId);
    List<NotificationResponse> getUnreadNotificationsForUser(Long userId);
    List<NotificationResponse> getNotificationsByType(Long userId, NotificationType type);
    long countUnreadForUser(Long userId);
}
