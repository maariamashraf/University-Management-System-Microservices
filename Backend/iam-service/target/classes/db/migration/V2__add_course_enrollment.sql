-- ============================================================
-- V2 — Course Enrollment join table
-- Relates users to course IDs (course-service owns course data)
-- No FK constraint on course_id — cross-service reference
-- ============================================================

CREATE TABLE IF NOT EXISTS course_enrollments (
    id          BIGSERIAL   PRIMARY KEY,
    user_id     BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id   BIGINT      NOT NULL,
    enrolled_at TIMESTAMP   NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_course UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollment_user   ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_course ON course_enrollments(course_id);
