package com.unisystem.academic_core_service.domain.application.services;

import com.unisystem.academic_core_service.domain.application.port.in.SubmitFeedbackUseCase;
import com.unisystem.academic_core_service.domain.application.port.out.FeedbackRepsitoryPort;
import com.unisystem.academic_core_service.domain.model.Feedback;

import java.time.LocalDateTime;

public class SubmitFeedbackService implements SubmitFeedbackUseCase {

    private final FeedbackRepsitoryPort feedbackRepository;

    public SubmitFeedbackService(FeedbackRepsitoryPort feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @Override
    public Feedback submit(FeedbackCommand cmd) {
        Feedback feedback = new Feedback();
        feedback.setId(cmd.id());
        feedback.setUserId(cmd.userId());
        feedback.setCourseId(cmd.courseId());
        feedback.setComment(cmd.comment());
        feedback.setCreatedAt(cmd.createdAt() != null ? cmd.createdAt() : LocalDateTime.now());
        return feedbackRepository.save(feedback);
    }
}
