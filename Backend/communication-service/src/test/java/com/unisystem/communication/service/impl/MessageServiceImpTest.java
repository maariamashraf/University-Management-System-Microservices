package com.unisystem.communication.service.impl;

import com.unisystem.communication.mapper.MessageMapper;
import com.unisystem.communication.persistence.dto.message.MessageRequest;
import com.unisystem.communication.persistence.dto.message.MessageResponse;
import com.unisystem.communication.persistence.entity.Course;
import com.unisystem.communication.persistence.entity.Message;
import com.unisystem.communication.persistence.entity.User;
import com.unisystem.communication.persistence.repository.MessageRepository;
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

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("MessageServiceImp Unit Tests")
class MessageServiceImpTest {

    @Mock private MessageRepository messageRepository;
    @Mock private MessageMapper messageMapper;
    @Mock private SimpMessagingTemplate messagingTemplate;

    @InjectMocks private MessageServiceImp messageService;

    private User mockUser;
    private Course mockCourse;
    private Message mockMessage;
    private MessageResponse mockResponse;
    private MessageRequest mockRequest;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .userName("ahmed_ali")
                .email("ahmed@uni.edu")
                .build();

        mockCourse = Course.builder()
                .id(1L)
                .name("Data Structures")
                .build();

        mockMessage = Message.builder()
                .id(1L)
                .course(mockCourse)
                .sender(mockUser)
                .content("Hello everyone!")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        mockResponse = MessageResponse.builder()
                .id(1L)
                .courseId(1L)
                .courseName("Data Structures")
                .senderId(1L)
                .senderName("ahmed_ali")
                .content("Hello everyone!")
                .createdAt(LocalDateTime.now())
                .build();

        mockRequest = MessageRequest.builder()
                .courseId(1L)
                .senderId(1L)
                .content("Hello everyone!")
                .build();
    }

    // ────────────────────────────────────────────────────────
    //  CREATE TESTS
    // ────────────────────────────────────────────────────────

    @Test
    @DisplayName("Should create message, save to DB, and broadcast via WebSocket")
    void createMessage_ShouldSaveAndBroadcastToCourseTopic() {
        when(messageMapper.mapToMessageEntity(any())).thenReturn(mockMessage);
        when(messageRepository.save(any())).thenReturn(mockMessage);
        when(messageMapper.mapToMessageResponse(any())).thenReturn(mockResponse);

        messageService.createMessage(mockRequest);

        verify(messageRepository, times(1)).save(any());
        // Cast to Object to resolve ambiguous convertAndSend overload
        verify(messagingTemplate, times(1))
                .convertAndSend(eq("/topic/course/1"), (Object) any(MessageResponse.class));
    }

    @Test
    @DisplayName("Should broadcast message to the correct course topic")
    void createMessage_ShouldBroadcastToCorrectCourseTopic() {
        when(messageMapper.mapToMessageEntity(any())).thenReturn(mockMessage);
        when(messageRepository.save(any())).thenReturn(mockMessage);
        when(messageMapper.mapToMessageResponse(any())).thenReturn(mockResponse);

        messageService.createMessage(mockRequest);

        // Cast to Object to resolve ambiguous convertAndSend overload
        verify(messagingTemplate).convertAndSend(eq("/topic/course/1"), (Object) any());
    }

    // ────────────────────────────────────────────────────────
    //  READ TESTS
    // ────────────────────────────────────────────────────────

    @Test
    @DisplayName("Should return messages for course ordered oldest first")
    void getMessagesByCourseId_ShouldReturnListOrderedAsc() {
        when(messageRepository.findByCourseIdOrderByCreatedAtAsc(1L))
                .thenReturn(List.of(mockMessage));
        when(messageMapper.mapToMessageResponse(any())).thenReturn(mockResponse);

        List<MessageResponse> result = messageService.getMessagesByCourseId(1L);

        assertThat(result).isNotNull().hasSize(1);
        assertThat(result.get(0).getCourseId()).isEqualTo(1L);
        assertThat(result.get(0).getContent()).isEqualTo("Hello everyone!");
        verify(messageRepository, times(1)).findByCourseIdOrderByCreatedAtAsc(1L);
    }

    @Test
    @DisplayName("Should return empty list when course has no messages")
    void getMessagesByCourseId_WhenNone_ShouldReturnEmptyList() {
        when(messageRepository.findByCourseIdOrderByCreatedAtAsc(99L))
                .thenReturn(List.of());

        List<MessageResponse> result = messageService.getMessagesByCourseId(99L);

        assertThat(result).isNotNull().isEmpty();
    }

    @Test
    @DisplayName("Should return messages by sender ID")
    void getMessagesBySenderId_ShouldReturnSenderMessages() {
        when(messageRepository.findBySenderIdOrderByCreatedAtDesc(1L))
                .thenReturn(List.of(mockMessage));
        when(messageMapper.mapToMessageResponse(any())).thenReturn(mockResponse);

        List<MessageResponse> result = messageService.getMessagesBySenderId(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getSenderId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Should return correct message count for course")
    void countMessagesByCourseId_ShouldReturnCorrectCount() {
        when(messageRepository.countByCourseId(1L)).thenReturn(10L);

        long count = messageService.countMessagesByCourseId(1L);

        assertThat(count).isEqualTo(10L);
        verify(messageRepository, times(1)).countByCourseId(1L);
    }

    // ────────────────────────────────────────────────────────
    //  DELETE TESTS
    // ────────────────────────────────────────────────────────

    @Test
    @DisplayName("Should delete message by ID when it exists")
    void deleteMessageById_WhenExists_ShouldCallRepository() {
        when(messageRepository.existsById(1L)).thenReturn(true);

        messageService.deleteMessageById(1L);

        verify(messageRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when deleting non-existent message")
    void deleteMessageById_WhenNotFound_ShouldThrow() {
        when(messageRepository.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> messageService.deleteMessageById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Message")
                .hasMessageContaining("999");
    }
}
