package com.unisystem.academic_core_service.domain.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class Feedback {
    private Long id;
    private Long userId;
    private Long courseId;
    private String comment;
    private LocalDateTime createdAt;
}
