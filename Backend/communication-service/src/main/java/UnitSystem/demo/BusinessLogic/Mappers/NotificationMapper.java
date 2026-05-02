package UnitSystem.demo.BusinessLogic.Mappers;

import UnitSystem.demo.DataAccessLayer.Dto.Notification.Course.NotificationCourseRequest;
import UnitSystem.demo.DataAccessLayer.Dto.Notification.User.NotificationRequest;
import UnitSystem.demo.DataAccessLayer.Dto.Notification.User.NotificationResponse;
import UnitSystem.demo.DataAccessLayer.Entities.*;
import UnitSystem.demo.DataAccessLayer.Repositories.CourseRepository;
import UnitSystem.demo.DataAccessLayer.Repositories.UserRepository;
import UnitSystem.demo.ExcHandler.Entites.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * SOLID — Single Responsibility:
 * This class is only responsible for mapping between
 * Notification entities and DTOs.
 */
@Component
@RequiredArgsConstructor
public class NotificationMapper {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public Notification mapToNotificationEntity(NotificationRequest request) {
        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.getRecipientId()));

        return Notification.builder()
                .recipient(recipient)
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType() != null ? request.getType() : NotificationType.SYSTEM)
                .build();
    }

    public Notification buildNotificationForUser(User recipient, String title,
                                                  String message, NotificationType type) {
        return Notification.builder()
                .recipient(recipient)
                .title(title)
                .message(message)
                .type(type)
                .build();
    }

    public NotificationResponse mapToNotificationResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .recipientId(notification.getRecipient().getId())
                .recipientName(notification.getRecipient().getUserName())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType().name())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .updatedAt(notification.getUpdatedAt())
                .build();
    }

    public List<Notification> mapCourseRequestToNotifications(NotificationCourseRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", request.getCourseId()));

        if (course.getCourseEnrollments().isEmpty()) {
            return Collections.emptyList();
        }

        NotificationType type = request.getType() != null
                ? request.getType()
                : NotificationType.ANNOUNCEMENT;

        return course.getCourseEnrollments().stream()
                .map(enrollment -> buildNotificationForUser(
                        enrollment.getStudent(),
                        request.getTitle(),
                        request.getMessage(),
                        type))
                .collect(Collectors.toList());
    }
}
