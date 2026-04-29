package com.unisystem.academic_core_service.infrastructure.adapters.out.kafka.kafkaConifg;

public final class KafkaTopics {
    public static final String STUDENT_ENROLLED = "student.enrolled";
    public static final String GRADE_SUBMITTED  = "grade.submitted";
    public static final String COURSE_CREATED   = "course.created";
    public static final String ANNOUNCEMENT_CREATED = "announcement.created";

    private KafkaTopics() {}
}
