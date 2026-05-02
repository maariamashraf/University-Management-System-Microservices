package UnitSystem.demo.BusinessLogic.ImpServiceLayer;

import UnitSystem.demo.BusinessLogic.InterfaceServiceLayer.MessageService;
import UnitSystem.demo.BusinessLogic.Mappers.MessageMapper;
import UnitSystem.demo.DataAccessLayer.Dto.Message.MessageRequest;
import UnitSystem.demo.DataAccessLayer.Dto.Message.MessageResponse;
import UnitSystem.demo.DataAccessLayer.Entities.Message;
import UnitSystem.demo.DataAccessLayer.Repositories.MessageRepository;
import UnitSystem.demo.ExcHandler.Entites.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * SOLID — Single Responsibility: handles message business logic only.
 * SOLID — Open/Closed: implements MessageService interface.
 * SOLID — Dependency Inversion: depends on MessageRepository abstraction.
 *
 * Layered Architecture: Service layer — between Controller and Repository.
 * Redis Cache: reads are cached; writes evict the cache.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MessageServiceImp implements MessageService {

    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;
    private final SimpMessagingTemplate messagingTemplate;

    // ────────────────────────────────────────────────────────
    // Write Operations — evict cache on every change
    // ────────────────────────────────────────────────────────

    @Override
    @CacheEvict(value = "messagesCache", allEntries = true)
    public void createMessage(MessageRequest messageRequest) {
        log.info("Creating message for course ID: {}", messageRequest.getCourseId());
        Message message = messageMapper.mapToMessageEntity(messageRequest);
        messageRepository.save(message);
        broadcastMessageToCourse(message);
    }

    @Override
    @CacheEvict(value = "messagesCache", allEntries = true)
    public void deleteMessageById(Long messageId) {
        log.info("Deleting message ID: {}", messageId);
        if (!messageRepository.existsById(messageId)) {
            throw new ResourceNotFoundException("Message", messageId);
        }
        messageRepository.deleteById(messageId);
    }

    // ────────────────────────────────────────────────────────
    // Read Operations — cached in Redis
    // ────────────────────────────────────────────────────────

    @Override
    @Cacheable(value = "messagesCache", key = "'messagesByCourse:' + #courseId")
    public List<MessageResponse> getMessagesByCourseId(Long courseId) {
        log.info("Fetching messages for course ID: {}", courseId);
        return messageRepository.findByCourseIdOrderByCreatedAtAsc(courseId)
                .stream()
                .map(messageMapper::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "messagesCache", key = "'messagesBySender:' + #senderId")
    public List<MessageResponse> getMessagesBySenderId(Long senderId) {
        log.info("Fetching messages for sender ID: {}", senderId);
        return messageRepository.findBySenderIdOrderByCreatedAtDesc(senderId)
                .stream()
                .map(messageMapper::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "messagesCache", key = "'countByCourse:' + #courseId")
    public long countMessagesByCourseId(Long courseId) {
        log.info("Counting messages for course ID: {}", courseId);
        return messageRepository.countByCourseId(courseId);
    }

    // ────────────────────────────────────────────────────────
    // Private helper — broadcasts saved message to course topic
    // ────────────────────────────────────────────────────────

    private void broadcastMessageToCourse(Message message) {
        log.info("Broadcasting message from user {} to course {}",
                message.getSender().getUserName(), message.getCourse().getName());
        MessageResponse response = messageMapper.mapToMessageResponse(message);
        messagingTemplate.convertAndSend(
                "/topic/course/" + response.getCourseId(),
                response);
    }
}
