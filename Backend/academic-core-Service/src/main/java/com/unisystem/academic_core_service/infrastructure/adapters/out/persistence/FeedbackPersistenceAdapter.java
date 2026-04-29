package com.unisystem.academic_core_service.infrastructure.adapters.out.persistence;

import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.FeedbackEntity;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.mapper.FeedbackPersistenceMapper;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.repository.FeedbackJpaRepository;
import com.unisystem.academic_core_service.domain.application.port.out.FeedbackRepsitoryPort;
import com.unisystem.academic_core_service.domain.model.Feedback;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class FeedbackPersistenceAdapter implements FeedbackRepsitoryPort {

    private final FeedbackJpaRepository feedbackJpaRepository;
    private final FeedbackPersistenceMapper feedbackPersistenceMapper;

    @Override
    public Feedback save(Feedback feedback) {
        FeedbackEntity saved = feedbackJpaRepository.save(feedbackPersistenceMapper.toEntity(feedback));
        return feedbackPersistenceMapper.toDomain(saved);
    }

    @Override
    public List<Feedback> findAll() {
        return feedbackJpaRepository.findAll().stream().map(feedbackPersistenceMapper::toDomain).toList();
    }

    @Override
    public Optional<Feedback> findById(Long id) {
        return feedbackJpaRepository.findById(id).map(feedbackPersistenceMapper::toDomain);
    }

    @Override
    public List<Feedback> findByCourseId(Long courseId) {
        return feedbackJpaRepository.findByCourseId(courseId).stream().map(feedbackPersistenceMapper::toDomain).toList();
    }

    @Override
    public List<Feedback> findByUserId(Long userId) {
        return feedbackJpaRepository.findByUserId(userId).stream().map(feedbackPersistenceMapper::toDomain).toList();
    }
}
