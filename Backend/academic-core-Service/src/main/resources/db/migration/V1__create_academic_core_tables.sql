-- 1. department (no dependencies)
CREATE TABLE IF NOT EXISTS department (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dep_name VARCHAR(255) UNIQUE NOT NULL
);

-- 2. teacher_department (depends on department)
CREATE TABLE IF NOT EXISTS teacher_department (
    teacher_id BIGINT NOT NULL COMMENT 'IAM service cross-reference, NO FK CONSTRAINT',
    dep_id BIGINT NOT NULL,
    PRIMARY KEY (teacher_id, dep_id),
    CONSTRAINT fk_teacher_dep_department FOREIGN KEY (dep_id) REFERENCES department(id) ON DELETE CASCADE,
    INDEX idx_teacher_id (teacher_id)
);

-- 3. courses (depends on department)
CREATE TABLE IF NOT EXISTS courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(255),
    course_dep BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL COMMENT 'IAM service cross-reference, NO FK CONSTRAINT',
    credits INT NOT NULL,
    capacity INT NOT NULL,
    CONSTRAINT fk_courses_department FOREIGN KEY (course_dep) REFERENCES department(id) ON DELETE CASCADE,
    INDEX idx_teacher_id (teacher_id),
    INDEX idx_course_dep (course_dep)
);

-- 4. course_prerequisites (depends on courses)
CREATE TABLE IF NOT EXISTS course_prerequisites (
    course_id BIGINT NOT NULL,
    course_prerequisite BIGINT NOT NULL,
    PRIMARY KEY (course_id, course_prerequisite),
    CONSTRAINT fk_prereq_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_prereq_prerequisite FOREIGN KEY (course_prerequisite) REFERENCES courses(id) ON DELETE CASCADE
);

-- 5. enrolled_courses (depends on courses)
CREATE TABLE IF NOT EXISTS enrolled_courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL COMMENT 'IAM service cross-reference, NO FK CONSTRAINT',
    course_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_enrolled_courses_id FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT unique_student_course UNIQUE (student_id, course_id),
    INDEX idx_student_id (student_id)
);

-- 6. audit_logs (standalone)
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL COMMENT 'IAM service cross-reference, NO FK CONSTRAINT. NULL allowed for system-triggered actions',
    action VARCHAR(255) NOT NULL,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action)
);

-- 7. announcements (depends on courses)
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    course_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_announcements_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course_id (course_id)
);

-- 8. feedback (no dependencies, cross-service reference only)
CREATE TABLE IF NOT EXISTS feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT 'IAM service cross-reference, NO FK CONSTRAINT',
    role_label VARCHAR(255) COMMENT '(e.g. ADMIN, TEACHER, STUDENT)',
    comment TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_role_label (role_label)
);
