package com.unisystem.academic_core_service.domain.application.port.in;

import com.unisystem.academic_core_service.domain.model.Feedback;

import java.time.LocalDateTime;

public interface SubmitFeedbackUseCase {
    Feedback submit(FeedbackCommand cmd);

    record FeedbackCommand(Long id,
                           Long userId,
                           Long courseId,
                           String comment,
                           LocalDateTime createdAt) { }
}