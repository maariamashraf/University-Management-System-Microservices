package com.unisystem.academic_core_service.domain.application.port.in;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface GetFeedBackQuery {
    List<FeedbackDTO> getFeedbacksByCourseId(Long courseId);
    List<FeedbackDTO> getFeedbacksByUserId(Long userId);
    Optional<FeedbackDTO> getFeedbackById(Long id);
    List<FeedbackDTO> getAllFeedbacks();

    record FeedbackDTO(Long id,
                       Long userId,
                       Long courseId,
                       String comment,
                       LocalDateTime createdAt) { }
}
