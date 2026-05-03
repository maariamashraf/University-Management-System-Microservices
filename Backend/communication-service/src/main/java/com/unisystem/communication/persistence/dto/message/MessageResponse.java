package com.unisystem.communication.persistence.dto.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponse {

    private Long id;
    private Long courseId;
    private String courseName;
    private Long senderId;
    private String senderName;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
