package com.unisystem.academic_core_service.domain.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class Announcement {
    private Long id;
    private String title;
    private String content;
    private Long courseId;
    private LocalDateTime createdAt;
}
