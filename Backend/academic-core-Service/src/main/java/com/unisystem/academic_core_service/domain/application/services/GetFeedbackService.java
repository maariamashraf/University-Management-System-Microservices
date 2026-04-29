package com.unisystem.academic_core_service.domain.application.services;

import com.unisystem.academic_core_service.domain.application.port.in.GetFeedBackQuery;
import com.unisystem.academic_core_service.domain.application.port.out.FeedbackRepsitoryPort;
import com.unisystem.academic_core_service.infrastructure.config.CacheConfig;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;
import java.util.Optional;

public class GetFeedbackService  implements GetFeedBackQuery {

     private final FeedbackRepsitoryPort feedbackRepository;

     public GetFeedbackService(FeedbackRepsitoryPort feedbackRepository) {
         this.feedbackRepository = feedbackRepository;
     }

    @Override
    @Cacheable(cacheNames = CacheConfig.FEEDBACK_BY_COURSE_CACHE, key = "#courseId")
    public List<FeedbackDTO> getFeedbacksByCourseId(Long courseId) {
        return feedbackRepository.findByCourseId(courseId).stream().map(this::toDto).toList();
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.FEEDBACK_BY_USER_CACHE, key = "#userId")
    public List<FeedbackDTO> getFeedbacksByUserId(Long userId) {
        return feedbackRepository.findByUserId(userId).stream().map(this::toDto).toList();
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.FEEDBACK_BY_ID_CACHE, key = "#id")
    public Optional<FeedbackDTO> getFeedbackById(Long id) {
        return feedbackRepository.findById(id).map(this::toDto);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.FEEDBACK_ALL_CACHE)
    public List<FeedbackDTO> getAllFeedbacks() {
        return feedbackRepository.findAll().stream().map(this::toDto).toList();
    }

    private FeedbackDTO toDto(com.unisystem.academic_core_service.domain.model.Feedback feedback) {
        return new FeedbackDTO(
                feedback.getId(),
                feedback.getUserId(),
                feedback.getCourseId(),
                feedback.getComment(),
                feedback.getCreatedAt()
        );
    }
}
