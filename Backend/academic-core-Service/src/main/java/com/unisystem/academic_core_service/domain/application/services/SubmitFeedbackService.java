package com.unisystem.academic_core_service.domain.application.services;

import com.unisystem.academic_core_service.domain.application.port.in.SubmitFeedbackUseCase;
import com.unisystem.academic_core_service.domain.application.port.out.FeedbackRepsitoryPort;
import com.unisystem.academic_core_service.domain.model.Feedback;
import com.unisystem.academic_core_service.infrastructure.config.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;

import java.time.LocalDateTime;

public class SubmitFeedbackService implements SubmitFeedbackUseCase {

    private final FeedbackRepsitoryPort feedbackRepository;

    public SubmitFeedbackService(FeedbackRepsitoryPort feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @Override
    @Caching(evict = {
            @CacheEvict(cacheNames = CacheConfig.FEEDBACK_BY_COURSE_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.FEEDBACK_BY_USER_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.FEEDBACK_BY_ID_CACHE, allEntries = true),
            @CacheEvict(cacheNames = CacheConfig.FEEDBACK_ALL_CACHE, allEntries = true)
    })
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
