package com.unisystem.academic_core_service.domain.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class Enrollment {

    private Long id;
    private Long studentId;
    private Long courseId;
    private LocalDateTime enrolledAt;


    public static Enrollment create(Long studentId, Long courseId) {
        Enrollment e = new Enrollment();
        e.studentId = studentId;
        e.courseId = courseId;
        e.enrolledAt = LocalDateTime.now();
        return e;
    }


}
