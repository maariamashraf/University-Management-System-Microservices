package com.unisystem.communication.service.impl;

import com.unisystem.communication.mapper.NotificationMapper;
import com.unisystem.communication.persistence.dto.notification.course.NotificationCourseRequest;
import com.unisystem.communication.persistence.dto.notification.user.NotificationRequest;
import com.unisystem.communication.persistence.dto.notification.user.NotificationResponse;
import com.unisystem.communication.persistence.entity.Notification;
import com.unisystem.communication.persistence.entity.NotificationType;
import com.unisystem.communication.persistence.entity.User;
import com.unisystem.communication.persistence.repository.NotificationRepository;
import com.unisystem.communication.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("NotificationServiceImp Unit Tests")
class NotificationServiceImpTest {

    @Mock private NotificationRepository notificationRepository;
    @Mock private SimpMessagingTemplate simpMessagingTemplate;
    @Mock private NotificationMapper notificationMapper;

    @InjectMocks private NotificationServiceImp notificationService;

    private User mockUser;
    private Notification mockNotification;
    private NotificationResponse mockResponse;
    private NotificationRequest mockRequest;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .userName("ahmed_ali")
                .email("ahmed@uni.edu")
                .build();

        mockNotification = Notification.builder()
                .id(1L)
                .recipient(mockUser)
                .title("Test Notification")
                .message("Test message")
                .type(NotificationType.SYSTEM)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        mockResponse = NotificationResponse.builder()
                .id(1L)
                .recipientId(1L)
                .recipientName("ahmed_ali")
                .title("Test Notification")
                .message("Test message")
                .type("SYSTEM")
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        mockRequest = NotificationRequest.builder()
                .recipientId(1L)
                .title("Test Notification")
                .message("Test message")
                .type(NotificationType.SYSTEM)
                .build();
    }

    // ────────────────────────────────────────────────────────
    //  CREATE TESTS
    // ────────────────────────────────────────────────────────

    @Test
    @DisplayName("Should create notification and return response")
    void createNotification_ShouldSaveAndReturnResponse() {
        when(notificationMapper.mapToNotificationEntity(any())).thenReturn(mockNotification);
        when(notificationRepository.save(any())).thenReturn(mockNotification);
        when(notificationMapper.mapToNotificationResponse(any())).thenReturn(mockResponse);

        NotificationResponse result = notificationService.createNotification(mockRequest);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getRecipientId()).isEqualTo(1L);
        assertThat(result.isRead()).isFalse();

        verify(notificationRepository, times(1)).save(any());
        verify(notificationMapper, times(1)).mapToNotificationEntity(any());
        verify(notificationMapper, times(1)).mapToNotificationResponse(any());
    }

    @Test
    @DisplayName("Should send notification to user and push via WebSocket")
    void sendNotificationToUser_ShouldSaveAndPushViaWebSocket() {
        when(notificationMapper.mapToNotificationEntity(any())).thenReturn(mockNotification);
        when(notificationRepository.save(any())).thenReturn(mockNotification);
        when(notificationMapper.mapToNotificationResponse(any())).thenReturn(mockResponse);

        notificationService.sendNotificationToUser(mockRequest);

        verify(notificationRepository, times(1)).save(any());
        verify(simpMessagingTemplate, times(1))
                .convertAndSendToUser(eq("ahmed@uni.edu"), eq("/queue/notifications"), any());
    }

    @Test
    @DisplayName("Should send notification to all course students and push via WebSocket")
    void sendNotificationToCourse_ShouldSaveAllAndPushToEachStudent() {
        User student2 = User.builder().id(2L).userName("sara").email("sara@uni.edu").build();
        Notification notification2 = Notification.builder()
                .id(2L).recipient(student2).title("Course Update")
                .message("Course updated").type(NotificationType.ANNOUNCEMENT).build();
        NotificationResponse response2 = NotificationResponse.builder()
                .id(2L).recipientId(2L).recipientName("sara").build();

        NotificationCourseRequest courseRequest = NotificationCourseRequest.builder()
                .courseId(1L).title("New Announcement").message("Check the syllabus")
                .type(NotificationType.ANNOUNCEMENT).build();

        when(notificationMapper.mapCourseRequestToNotifications(any()))
                .thenReturn(List.of(mockNotification, notification2));
        when(notificationRepository.saveAll(any())).thenReturn(List.of(mockNotification, notification2));
        when(notificationMapper.mapToNotificationResponse(mockNotification)).thenReturn(mockResponse);
        when(notificationMapper.mapToNotificationResponse(notification2)).thenReturn(response2);

        notificationService.sendNotificationToCourse(courseRequest);

        verify(notificationRepository, times(1)).saveAll(any());
        verify(simpMessagingTemplate, times(1))
                .convertAndSendToUser(eq("ahmed@uni.edu"), eq("/queue/notifications"), any());
        verify(simpMessagingTemplate, times(1))
                .convertAndSendToUser(eq("sara@uni.edu"), eq("/queue/notifications"), any());
    }

    @Test
    @DisplayName("Should not send notifications when no students are enrolled")
    void sendNotificationToCourse_WhenNoStudents_ShouldNotSave() {
        NotificationCourseRequest courseRequest = NotificationCourseRequest.builder()
                .courseId(99L).title("Test").message("Test").build();

        when(notificationMapper.mapCourseRequestToNotifications(any())).thenReturn(List.of());

        notificationService.sendNotificationToCourse(courseRequest);

        verify(notificationRepository, never()).saveAll(any());
        verify(simpMessagingTemplate, never()).convertAndSendToUser(any(), any(), any());
    }

    // ────────────────────────────────────────────────────────
    //  READ TESTS
    // ────────────────────────────────────────────────────────

    @Test
    @DisplayName("Should return notification by ID")
    void getNotificationById_WhenExists_ShouldReturnResponse() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(mockNotification));
        when(notificationMapper.mapToNotificationResponse(mockNotification)).thenReturn(mockResponse);

        NotificationResponse result = notificationService.getNotificationById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        verify(notificationRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when notification not found")
    void getNotificationById_WhenNotFound_ShouldThrowException() {
        when(notificationRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> notificationService.getNotificationById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Notification")
                .hasMessageContaining("999");
    }

    @Test
    @DisplayName("Should return all notifications for user ordered newest first")
    void getAllNotificationsForUser_ShouldReturnList() {
        when(notificationRepository.findByRecipientIdOrderByCreatedAtDesc(1L))
                .thenReturn(List.of(mockNotification));
        when(notificationMapper.mapToNotificationResponse(any())).thenReturn(mockResponse);

        List<NotificationResponse> result = notificationService.getAllNotificationsForUser(1L);

        assertThat(result).isNotNull().hasSize(1);
        assertThat(result.get(0).getRecipientId()).isEqualTo(1L);
        verify(notificationRepository, times(1)).findByRecipientIdOrderByCreatedAtDesc(1L);
    }

    @Test
    @DisplayName("Should return empty list when user has no notifications")
    void getAllNotificationsForUser_WhenNone_ShouldReturnEmptyList() {
        when(notificationRepository.findByRecipientIdOrderByCreatedAtDesc(99L))
                .thenReturn(List.of());

        List<NotificationResponse> result = notificationService.getAllNotificationsForUser(99L);

        assertThat(result).isNotNull().isEmpty();
    }

    @Test
    @DisplayName("Should return only unread notifications")
    void getUnreadNotificationsForUser_ShouldReturnOnlyUnread() {
        when(notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(1L))
                .thenReturn(List.of(mockNotification));
        when(notificationMapper.mapToNotificationResponse(any())).thenReturn(mockResponse);

        List<NotificationResponse> result = notificationService.getUnreadNotificationsForUser(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).isRead()).isFalse();
    }

    @Test
    @DisplayName("Should return correct unread count")
    void countUnreadForUser_ShouldReturnCorrectCount() {
        when(notificationRepository.countByRecipientIdAndIsReadFalse(1L)).thenReturn(3L);

        long count = notificationService.countUnreadForUser(1L);

        assertThat(count).isEqualTo(3L);
        verify(notificationRepository, times(1)).countByRecipientIdAndIsReadFalse(1L);
    }

    @Test
    @DisplayName("Should return notifications filtered by type")
    void getNotificationsByType_ShouldFilterCorrectly() {
        when(notificationRepository
                .findByRecipientIdAndTypeOrderByCreatedAtDesc(1L, NotificationType.ENROLLMENT))
                .thenReturn(List.of(mockNotification));
        when(notificationMapper.mapToNotificationResponse(any())).thenReturn(mockResponse);

        List<NotificationResponse> result =
                notificationService.getNotificationsByType(1L, NotificationType.ENROLLMENT);

        assertThat(result).hasSize(1);
    }

    // ────────────────────────────────────────────────────────
    //  UPDATE TESTS
    // ────────────────────────────────────────────────────────

    @Test
    @DisplayName("Should mark notification as read")
    void markAsRead_ShouldSetIsReadToTrue() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(mockNotification));
        when(notificationRepository.save(any())).thenReturn(mockNotification);
        mockResponse.setRead(true);
        when(notificationMapper.mapToNotificationResponse(any())).thenReturn(mockResponse);

        NotificationResponse result = notificationService.markAsRead(1L);

        assertThat(result.isRead()).isTrue();
        verify(notificationRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when marking non-existent notification as read")
    void markAsRead_WhenNotFound_ShouldThrow() {
        when(notificationRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> notificationService.markAsRead(999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Should mark all notifications as read and return updated count")
    void markAllAsReadForUser_ShouldReturnUpdatedCount() {
        when(notificationRepository.markAllAsReadForUser(1L)).thenReturn(5);

        int result = notificationService.markAllAsReadForUser(1L);

        assertThat(result).isEqualTo(5);
        verify(notificationRepository, times(1)).markAllAsReadForUser(1L);
    }

    // ────────────────────────────────────────────────────────
    //  DELETE TESTS
    // ────────────────────────────────────────────────────────

    @Test
    @DisplayName("Should delete notification by ID")
    void deleteNotificationById_ShouldCallRepository() {
        when(notificationRepository.existsById(1L)).thenReturn(true);

        notificationService.deleteNotificationById(1L);

        verify(notificationRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when deleting non-existent notification")
    void deleteNotificationById_WhenNotFound_ShouldThrow() {
        when(notificationRepository.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> notificationService.deleteNotificationById(999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Should delete all notifications for a user")
    void deleteAllNotificationsForUser_ShouldCallRepository() {
        notificationService.deleteAllNotificationsForUser(1L);
        verify(notificationRepository, times(1)).deleteAllByRecipientId(1L);
    }
}
