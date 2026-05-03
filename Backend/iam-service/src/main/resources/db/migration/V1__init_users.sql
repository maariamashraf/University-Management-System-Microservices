-- ============================================================
-- V1 — Initial Schema: Users (JOINED inheritance)
-- MySQL-compatible version
-- ============================================================

-- Base users table (all user types share these columns)
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    username    VARCHAR(50)     NOT NULL UNIQUE,
    email       VARCHAR(255)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    user_type   VARCHAR(31)     NOT NULL,   -- discriminator: STUDENT | TEACHER | ADMIN
    role        VARCHAR(20)     NOT NULL,   -- enum: STUDENT | TEACHER | ADMIN
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Students child table (JOINED strategy — FK to users.id)
CREATE TABLE IF NOT EXISTS students (
    id              BIGINT          NOT NULL,
    student_number  VARCHAR(50)     UNIQUE,
    department      VARCHAR(100),
    year_of_study   INT,
    PRIMARY KEY (id),
    CONSTRAINT fk_students_users FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Teachers child table (JOINED strategy — FK to users.id)
CREATE TABLE IF NOT EXISTS teachers (
    id              BIGINT          NOT NULL,
    faculty         VARCHAR(100),
    office_number   VARCHAR(50),
    specialization  VARCHAR(150),
    PRIMARY KEY (id),
    CONSTRAINT fk_teachers_users FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes for common lookups
CREATE INDEX idx_users_role       ON users(role);
CREATE INDEX idx_users_user_type  ON users(user_type);
CREATE INDEX idx_students_dept    ON students(department);
CREATE INDEX idx_teachers_faculty ON teachers(faculty);
