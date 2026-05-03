-- Schema aligned with JPA entities (departments, courses, enrollments, announcements, feedback).
-- IAM users table is populated separately.

CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    course_code VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    start_date DATE,
    end_date DATE,
    credits INT NOT NULL,
    max_students INT NOT NULL,
    enrolled_count INT NOT NULL DEFAULT 0,
    department_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    CONSTRAINT fk_courses_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    INDEX idx_courses_teacher_id (teacher_id),
    INDEX idx_courses_department_id (department_id)
);

CREATE TABLE IF NOT EXISTS teacher_department (
    teacher_id BIGINT NOT NULL COMMENT 'IAM teacher id; no FK to users here',
    dep_id BIGINT NOT NULL,
    PRIMARY KEY (teacher_id, dep_id),
    CONSTRAINT fk_teacher_dep_department FOREIGN KEY (dep_id) REFERENCES departments(id) ON DELETE CASCADE,
    INDEX idx_teacher_dep_teacher_id (teacher_id)
);

CREATE TABLE IF NOT EXISTS course_prerequisites (
    course_id BIGINT NOT NULL,
    course_prerequisite BIGINT NOT NULL,
    PRIMARY KEY (course_id, course_prerequisite),
    CONSTRAINT fk_prereq_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_prereq_prerequisite FOREIGN KEY (course_prerequisite) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS enrollments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL COMMENT 'IAM student id',
    course_id BIGINT NOT NULL,
    enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_enrollments_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT unique_student_course UNIQUE (student_id, course_id),
    INDEX idx_enrollments_student_id (student_id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_user_id (user_id),
    INDEX idx_audit_action (action)
);

CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    course_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_announcements_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_announcements_course_id (course_id)
);

CREATE TABLE IF NOT EXISTS feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    comment TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_feedback_user_id (user_id)
);
