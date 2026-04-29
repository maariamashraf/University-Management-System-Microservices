package com.unisystem.academic_core_service.domain.application.port.out;

import com.unisystem.academic_core_service.domain.model.Feedback;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepsitoryPort {
     Feedback save(Feedback feedback);
     List<Feedback> findAll();
     Optional<Feedback> findById(Long id);
     List<Feedback> findByCourseId(Long courseId);
     List<Feedback> findByUserId(Long userId);
}
