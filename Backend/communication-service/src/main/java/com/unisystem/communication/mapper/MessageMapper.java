package com.unisystem.communication.mapper;

import com.unisystem.communication.persistence.dto.message.MessageRequest;
import com.unisystem.communication.persistence.dto.message.MessageResponse;
import com.unisystem.communication.persistence.entity.Message;
import com.unisystem.communication.persistence.repository.CourseRepository;
import com.unisystem.communication.persistence.repository.UserRepository;
import com.unisystem.communication.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * SOLID — Single Responsibility:
 * Only responsible for mapping between Message entities and DTOs.
 */
@Component
@RequiredArgsConstructor
public class MessageMapper {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public Message mapToMessageEntity(MessageRequest request) {
        var sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.getSenderId()));

        var course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", request.getCourseId()));

        return Message.builder()
                .content(request.getContent())
                .sender(sender)
                .course(course)
                .build();
    }

    public MessageResponse mapToMessageResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .courseId(message.getCourse().getId())
                .courseName(message.getCourse().getName())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getUserName())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .updatedAt(message.getUpdatedAt())
                .build();
    }
}
