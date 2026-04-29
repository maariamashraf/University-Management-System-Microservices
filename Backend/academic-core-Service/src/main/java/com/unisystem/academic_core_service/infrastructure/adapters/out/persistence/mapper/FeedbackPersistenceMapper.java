package com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.mapper;

import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.FeedbackEntity;
import com.unisystem.academic_core_service.domain.model.Feedback;
import org.springframework.stereotype.Component;

@Component
public class FeedbackPersistenceMapper {

    public FeedbackEntity toEntity(Feedback feedback) {
        FeedbackEntity entity = new FeedbackEntity();
        entity.setId(feedback.getId());
        entity.setUserId(feedback.getUserId());
        entity.setCourseId(feedback.getCourseId());
        entity.setComment(feedback.getComment());
        entity.setCreatedAt(feedback.getCreatedAt());
        return entity;
    }

    public Feedback toDomain(FeedbackEntity entity) {
        Feedback feedback = new Feedback();
        feedback.setId(entity.getId());
        feedback.setUserId(entity.getUserId());
        feedback.setCourseId(entity.getCourseId());
        feedback.setComment(entity.getComment());
        feedback.setCreatedAt(entity.getCreatedAt());
        return feedback;
    }
}
