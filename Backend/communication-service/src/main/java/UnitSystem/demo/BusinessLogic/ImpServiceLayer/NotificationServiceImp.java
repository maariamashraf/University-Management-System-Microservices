package UnitSystem.demo.BusinessLogic.ImpServiceLayer;

import UnitSystem.demo.BusinessLogic.InterfaceServiceLayer.NotificationService;
import UnitSystem.demo.BusinessLogic.Mappers.NotificationMapper;
import UnitSystem.demo.DataAccessLayer.Dto.Notification.Course.NotificationCourseRequest;
import UnitSystem.demo.DataAccessLayer.Dto.Notification.User.NotificationRequest;
import UnitSystem.demo.DataAccessLayer.Dto.Notification.User.NotificationResponse;
import UnitSystem.demo.DataAccessLayer.Entities.Notification;
import UnitSystem.demo.DataAccessLayer.Entities.NotificationType;
import UnitSystem.demo.DataAccessLayer.Repositories.NotificationRepository;
import UnitSystem.demo.ExcHandler.Entites.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * SOLID — Single Responsibility: handles notification business logic only.
 * SOLID — Open/Closed: implements NotificationService interface.
 * SOLID — Dependency Inversion: depends on abstractions, not implementations.
 *
 * Layered Architecture: Service layer — sits between Controller and Repository.
 * Cache: reads are cached; writes evict the cache to keep data fresh.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImp implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final NotificationMapper notificationMapper;

    // ────────────────────────────────────────────────────────
    // Write Operations — evict cache on every change
    // ────────────────────────────────────────────────────────

    @Override
    @Transactional
    @CacheEvict(value = "notificationsCache", allEntries = true)
    public NotificationResponse createNotification(NotificationRequest notificationRequest) {
        log.info("Creating notification for recipient ID: {}", notificationRequest.getRecipientId());
        Notification notification = notificationMapper.mapToNotificationEntity(notificationRequest);
        notificationRepository.save(notification);
        return notificationMapper.mapToNotificationResponse(notification);
    }

    @Override
    @Transactional
    @CacheEvict(value = "notificationsCache", allEntries = true)
    public NotificationResponse markAsRead(Long notificationId) {
        log.info("Marking notification ID: {} as read", notificationId);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId));
        notification.setRead(true);
        notificationRepository.save(notification);
        return notificationMapper.mapToNotificationResponse(notification);
    }

    @Override
    @Transactional
    @CacheEvict(value = "notificationsCache", allEntries = true)
    public int markAllAsReadForUser(Long userId) {
        log.info("Marking all notifications as read for user ID: {}", userId);
        return notificationRepository.markAllAsReadForUser(userId);
    }

    @Override
    @Transactional
    @CacheEvict(value = "notificationsCache", allEntries = true)
    public void deleteNotificationById(Long notificationId) {
        log.info("Deleting notification ID: {}", notificationId);
        if (!notificationRepository.existsById(notificationId)) {
            throw new ResourceNotFoundException("Notification", notificationId);
        }
        notificationRepository.deleteById(notificationId);
    }

    @Override
    @Transactional
    @CacheEvict(value = "notificationsCache", allEntries = true)
    public void deleteAllNotificationsForUser(Long userId) {
        log.info("Deleting all notifications for user ID: {}", userId);
        notificationRepository.deleteAllByRecipientId(userId);
    }

    // ────────────────────────────────────────────────────────
    // WebSocket Push Operations
    // ────────────────────────────────────────────────────────

    @Override
    @Transactional
    @CacheEvict(value = "notificationsCache", allEntries = true)
    public void sendNotificationToUser(NotificationRequest notificationRequest) {
        log.info("Sending notification to user ID: {}", notificationRequest.getRecipientId());
        Notification notification = notificationMapper.mapToNotificationEntity(notificationRequest);
        notificationRepository.save(notification);
        NotificationResponse response = notificationMapper.mapToNotificationResponse(notification);
        String wsPrincipal = resolveWsPrincipal(notification);

        simpMessagingTemplate.convertAndSendToUser(
                wsPrincipal,
                "/queue/notifications",
                response);
    }

    @Override
    @Transactional
    @CacheEvict(value = "notificationsCache", allEntries = true)
    public void sendNotificationToCourse(NotificationCourseRequest notificationRequest) {
        log.info("Sending notification to all students in course ID: {}", notificationRequest.getCourseId());
        List<Notification> notifications = notificationMapper.mapCourseRequestToNotifications(notificationRequest);

        if (notifications.isEmpty()) {
            log.warn("No enrolled students found for course ID: {}", notificationRequest.getCourseId());
            return;
        }

        notificationRepository.saveAll(notifications);

        notifications.forEach(notification -> {
            String wsPrincipal = resolveWsPrincipal(notification);

            simpMessagingTemplate.convertAndSendToUser(
                    wsPrincipal,
                    "/queue/notifications",
                    notificationMapper.mapToNotificationResponse(notification));
        });
    }

    private String resolveWsPrincipal(Notification notification) {
        String userName = notification.getRecipient().getUserName();
        if (userName != null && !userName.isBlank()) return userName;
        return Objects.requireNonNull(notification.getRecipient().getEmail(),
                "Recipient email is required when username is missing");
    }

    // ────────────────────────────────────────────────────────
    // Read Operations — cached
    // ────────────────────────────────────────────────────────

    @Override
    @Cacheable(value = "notificationsCache", key = "'notificationById:' + #notificationId")
    public NotificationResponse getNotificationById(Long notificationId) {
        log.info("Fetching notification ID: {}", notificationId);
        return notificationRepository.findById(notificationId)
                .map(notificationMapper::mapToNotificationResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId));
    }

    @Override
    @Cacheable(value = "notificationsCache", key = "'allForUser:' + #userId")
    public List<NotificationResponse> getAllNotificationsForUser(Long userId) {
        log.info("Fetching all notifications for user ID: {}", userId);
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(notificationMapper::mapToNotificationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "notificationsCache", key = "'unreadForUser:' + #userId")
    public List<NotificationResponse> getUnreadNotificationsForUser(Long userId) {
        log.info("Fetching unread notifications for user ID: {}", userId);
        return notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(notificationMapper::mapToNotificationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "notificationsCache", key = "'byType:' + #userId + ':' + #type")
    public List<NotificationResponse> getNotificationsByType(Long userId, NotificationType type) {
        log.info("Fetching {} notifications for user ID: {}", type, userId);
        return notificationRepository.findByRecipientIdAndTypeOrderByCreatedAtDesc(userId, type)
                .stream()
                .map(notificationMapper::mapToNotificationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "notificationsCache", key = "'unreadCount:' + #userId")
    public long countUnreadForUser(Long userId) {
        log.info("Counting unread notifications for user ID: {}", userId);
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }
}
