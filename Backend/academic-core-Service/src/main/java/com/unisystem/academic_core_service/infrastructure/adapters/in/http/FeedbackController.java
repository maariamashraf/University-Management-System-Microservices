package com.unisystem.academic_core_service.infrastructure.adapters.in.http;

import com.unisystem.academic_core_service.domain.application.port.in.GetFeedBackQuery;
import com.unisystem.academic_core_service.domain.application.port.in.SubmitFeedbackUseCase;
import com.unisystem.academic_core_service.domain.model.Feedback;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {

    private final SubmitFeedbackUseCase submitFeedbackUseCase;
    private final GetFeedBackQuery getFeedBackQuery;

    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(@RequestBody SubmitFeedbackUseCase.FeedbackCommand command) {
        return ResponseEntity.ok(submitFeedbackUseCase.submit(command));
    }

    @GetMapping
    public ResponseEntity<List<GetFeedBackQuery.FeedbackDTO>> getAllFeedbacks() {
        return ResponseEntity.ok(getFeedBackQuery.getAllFeedbacks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GetFeedBackQuery.FeedbackDTO> getFeedbackById(@PathVariable Long id) {
        return getFeedBackQuery.getFeedbackById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<GetFeedBackQuery.FeedbackDTO>> getFeedbackByCourseId(@PathVariable Long courseId) {
        return ResponseEntity.ok(getFeedBackQuery.getFeedbacksByCourseId(courseId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GetFeedBackQuery.FeedbackDTO>> getFeedbackByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(getFeedBackQuery.getFeedbacksByUserId(userId));
    }
}
