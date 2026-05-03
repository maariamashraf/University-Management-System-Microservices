-- ============================================================
-- V1 — Initial Schema: Users (JOINED inheritance)
-- ============================================================

-- Base users table (all user types share these columns)
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50)     NOT NULL UNIQUE,
    email       VARCHAR(255)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    user_type   VARCHAR(31)     NOT NULL,   -- discriminator: STUDENT | TEACHER | ADMIN
    role        VARCHAR(20)     NOT NULL,   -- enum: STUDENT | TEACHER | ADMIN
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Students child table (JOINED strategy — FK to users.id)
CREATE TABLE IF NOT EXISTS students (
    id              BIGINT          PRIMARY KEY,
    student_number  VARCHAR(50)     UNIQUE,
    dep_id          BIGINT,         -- cross-reference to academic core department(id)
    year_of_study   INT,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Teachers child table (JOINED strategy — FK to users.id)
CREATE TABLE IF NOT EXISTS teachers (
    id              BIGINT          PRIMARY KEY,
    office_number   VARCHAR(50),
    specialization  VARCHAR(150),
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_users_role      ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_students_dep_id ON students(dep_id);
