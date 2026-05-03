package UnitSystem.demo.BusinessLogic.Mappers;

import UnitSystem.demo.DataAccessLayer.Dto.Message.MessageRequest;
import UnitSystem.demo.DataAccessLayer.Dto.Message.MessageResponse;
import UnitSystem.demo.DataAccessLayer.Entities.Message;
import UnitSystem.demo.DataAccessLayer.Repositories.CourseRepository;
import UnitSystem.demo.DataAccessLayer.Repositories.UserRepository;
import UnitSystem.demo.ExcHandler.Entites.ResourceNotFoundException;
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
