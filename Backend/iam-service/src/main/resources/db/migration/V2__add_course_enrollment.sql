-- ============================================================
-- V2 — Course Enrollment join table
-- Relates users to course IDs (course-service owns course data)
-- No FK constraint on course_id — cross-service reference
-- MySQL-compatible version
-- ============================================================

CREATE TABLE IF NOT EXISTS course_enrollments (
    id          BIGINT      NOT NULL AUTO_INCREMENT,
    user_id     BIGINT      NOT NULL,
    course_id   BIGINT      NOT NULL,
    enrolled_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_user_course UNIQUE (user_id, course_id),
    CONSTRAINT fk_enrollment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_enrollment_user   ON course_enrollments(user_id);
CREATE INDEX idx_enrollment_course ON course_enrollments(course_id);
