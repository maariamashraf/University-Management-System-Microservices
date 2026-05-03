package com.unisystem.academic_core_service.domain.application.services;

import com.unisystem.academic_core_service.domain.application.port.in.GetFeedBackQuery;
import com.unisystem.academic_core_service.domain.application.port.out.FeedbackRepsitoryPort;

import java.util.List;
import java.util.Optional;

public class GetFeedbackService  implements GetFeedBackQuery {

     private final FeedbackRepsitoryPort feedbackRepository;

     public GetFeedbackService(FeedbackRepsitoryPort feedbackRepository) {
         this.feedbackRepository = feedbackRepository;
     }

    @Override
    public List<FeedbackDTO> getFeedbacksByCourseId(Long courseId) {
        return feedbackRepository.findByCourseId(courseId).stream().map(this::toDto).toList();
    }

    @Override
    public List<FeedbackDTO> getFeedbacksByUserId(Long userId) {
        return feedbackRepository.findByUserId(userId).stream().map(this::toDto).toList();
    }

    @Override
    public Optional<FeedbackDTO> getFeedbackById(Long id) {
        return feedbackRepository.findById(id).map(this::toDto);
    }

    @Override
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
