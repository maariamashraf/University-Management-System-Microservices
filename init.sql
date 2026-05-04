-- ==========================================
-- 1. IAM SERVICE TABLES
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50)     NOT NULL UNIQUE,
    email       VARCHAR(255)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    role        VARCHAR(20)     NOT NULL,   -- STUDENT | TEACHER | ADMIN
    active      BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);

CREATE TABLE IF NOT EXISTS students (
    user_id         BIGINT PRIMARY KEY,
    gpa             DECIMAL(3, 2),
    enrollment_date DATE,
    total_credits   INT,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS teachers (
    user_id         BIGINT PRIMARY KEY, -- Fixed from 'id' to 'user_id' for consistency
    office_location VARCHAR(50),
    salary          DECIMAL(10, 2),
    CONSTRAINT fk_teacher_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admins (
    user_id         BIGINT PRIMARY KEY,
    CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- 2. ACADEMIC CORE TABLES
-- ==========================================
CREATE TABLE IF NOT EXISTS departments (
    id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS courses (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    course_code    VARCHAR(255) NOT NULL UNIQUE,
    description    TEXT,
    start_date     DATE,
    end_date       DATE,
    credits        INT NOT NULL,
    max_students   INT NOT NULL,
    enrolled_count INT NOT NULL DEFAULT 0,
    department_id  BIGINT NOT NULL,
    teacher_id     BIGINT NOT NULL,
    CONSTRAINT fk_courses_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    CONSTRAINT fk_courses_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_courses_teacher_id (teacher_id),
    INDEX idx_courses_department_id (department_id)
);

CREATE TABLE IF NOT EXISTS course_prerequisites (
    course_id           BIGINT NOT NULL,
    course_prerequisite BIGINT NOT NULL,
    PRIMARY KEY (course_id, course_prerequisite),
    CONSTRAINT fk_prereq_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_prereq_prerequisite FOREIGN KEY (course_prerequisite) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS enrollments (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id  BIGINT NOT NULL,
    enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_enrollments_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollments_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT unique_student_course UNIQUE (student_id, course_id),
    INDEX idx_enrollments_student_id (student_id)
);

CREATE TABLE IF NOT EXISTS announcements (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    course_id   BIGINT NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_announcements_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_announcements_course_id (course_id)
);

CREATE TABLE IF NOT EXISTS feedback (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    course_id  BIGINT NOT NULL,
    comment    TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_feedback_user_id (user_id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT NULL,
    action     VARCHAR(255) NOT NULL,
    details    TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_user_id (user_id),
    INDEX idx_audit_action (action)
);

-- ==========================================
-- 3. COMMUNICATION TABLES
-- ==========================================
CREATE TABLE IF NOT EXISTS notifications (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT       NOT NULL,
    title      VARCHAR(255) NOT NULL,
    message    TEXT         NOT NULL,
    type       VARCHAR(50)  NOT NULL DEFAULT 'SYSTEM',
    is_read    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user_id  (user_id),
    INDEX idx_notifications_is_read  (user_id, is_read),
    INDEX idx_notifications_type     (user_id, type)
);

CREATE TABLE IF NOT EXISTS messages (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id  BIGINT       NOT NULL,
    sender_id  BIGINT       NOT NULL,
    content    TEXT         NOT NULL,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_message_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_message_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_messages_course_id  (course_id),
    INDEX idx_messages_sender_id  (sender_id)
);

-- =========================================================
-- 1. Insert Base Users (Parent Table)
-- Note: Using dummy BCrypt hashes for realistic Spring Security testing
-- =========================================================
INSERT INTO users (username, email, password, role, active) VALUES
('admin_super', 'admin@helwan.edu.eg', '$2a$10$r9/k2mJp9n2gCj.Z.h1K/eH/2rO4v/3', 'ADMIN', TRUE),
('dr_ahmed', 'ahmed@helwan.edu.eg', '$2a$10$r9/k2mJp9n2gCj.Z.h1K/eH/2rO4v/3', 'TEACHER', TRUE),
('dr_sara', 'sara@helwan.edu.eg', '$2a$10$r9/k2mJp9n2gCj.Z.h1K/eH/2rO4v/3', 'TEACHER', TRUE),
('student_ali', 'ali@student.helwan.edu.eg', '$2a$10$r9/k2mJp9n2gCj.Z.h1K/eH/2rO4v/3', 'STUDENT', TRUE),
('student_mona', 'mona@student.helwan.edu.eg', '$2a$10$r9/k2mJp9n2gCj.Z.h1K/eH/2rO4v/3', 'STUDENT', TRUE);

-- =========================================================
-- 2. Insert Role-Specific Data (Child Tables of 'users')
-- =========================================================
-- Admins
INSERT INTO admins (user_id) VALUES (1);

-- Teachers
INSERT INTO teachers (user_id, office_location, salary) VALUES
(2, 'Building A, Room 301', 15000.00),
(3, 'Building B, Room 205', 14500.00);

-- Students
INSERT INTO students (user_id, gpa, enrollment_date, total_credits) VALUES
(4, 3.80, '2023-09-01', 45),
(5, 3.20, '2024-09-01', 15);

-- =========================================================
-- 3. Insert Departments (Parent Table for 'courses')
-- =========================================================
INSERT INTO departments (name) VALUES
('Computer Science'),
('Information Technology');

-- =========================================================
-- 4. Insert Courses (Child of 'departments' and 'teachers')
-- =========================================================
INSERT INTO courses (name, course_code, description, start_date, end_date, credits, max_students, department_id, teacher_id) VALUES
('Introduction to Programming', 'CS101', 'Basics of programming using Java', '2026-09-15', '2026-12-15', 3, 50, 1, 2),
('Data Structures', 'CS201', 'Advanced data structures and algorithms', '2026-09-15', '2026-12-15', 3, 40, 1, 2),
('Network Fundamentals', 'IT101', 'Introduction to computer networks', '2026-09-15', '2026-12-15', 3, 60, 2, 3);

-- =========================================================
-- 5. Insert Course Prerequisites (Child of 'courses')
-- =========================================================
INSERT INTO course_prerequisites (course_id, course_prerequisite) VALUES
(2, 1); -- Data Structures (Course 2) requires Intro to Programming (Course 1)

-- =========================================================
-- 6. Insert Enrollments (Child of 'students' and 'courses')
-- =========================================================
INSERT INTO enrollments (student_id, course_id) VALUES
(4, 1),
(4, 2),
(5, 1);

-- =========================================================
-- 7. Insert Announcements (Child of 'courses')
-- =========================================================
INSERT INTO announcements (title, description, course_id) VALUES
('Welcome to CS101', 'Please download the JDK before our first lecture.', 1),
('Midterm Exam Date', 'The midterm will be held on Nov 10th in Hall A.', 2);

-- =========================================================
-- 8. Insert Feedback (Child of 'users' and 'courses')
-- =========================================================
INSERT INTO feedback (user_id, course_id, comment) VALUES
(4, 1, 'Great introductory course, the examples were very clear.');

-- =========================================================
-- 9. Insert Audit Logs (Child of 'users')
-- =========================================================
INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES
(1, 'SYSTEM_START', 'System initialization completed', '127.0.0.1'),
(4, 'COURSE_ENROLLED', 'Student successfully enrolled in CS101', '192.168.1.10');

-- =========================================================
-- 10. Insert Notifications (Child of 'users')
-- =========================================================
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(4, 'Enrollment Successful', 'You have been successfully enrolled in CS101.', 'SYSTEM', FALSE),
(2, 'New Student Enrollment', 'A new student has joined CS101.', 'COURSE', TRUE);

-- =========================================================
-- 11. Insert Messages (Child of 'courses' and 'users')
-- =========================================================
INSERT INTO messages (course_id, sender_id, content) VALUES
(1, 2, 'Welcome everyone! Feel free to ask questions here.'),
(1, 4, 'Thank you Doctor, looking forward to the lectures.');