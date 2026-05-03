-- ============================================================
-- V1 — Initial Schema: Users (JOINED inheritance)
-- ============================================================

-- Base users table (all user types share these columns)
CREATE TABLE IF NOT EXISTS users (
    id          BIGSERIAL       PRIMARY KEY,
    username    VARCHAR(50)     NOT NULL UNIQUE,
    email       VARCHAR(255)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    user_type   VARCHAR(31)     NOT NULL,   -- discriminator: STUDENT | TEACHER | ADMIN
    role        VARCHAR(20)     NOT NULL,   -- enum: STUDENT | TEACHER | ADMIN
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Students child table (JOINED strategy — FK to users.id)
CREATE TABLE IF NOT EXISTS students (
    id              BIGINT          PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    student_number  VARCHAR(50)     UNIQUE,
    dep_id          BIGINT,         -- cross-reference to academic core department(id)
    year_of_study   INT
);

-- Teachers child table (JOINED strategy — FK to users.id)
CREATE TABLE IF NOT EXISTS teachers (
    id              BIGINT          PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    office_number   VARCHAR(50),
    specialization  VARCHAR(150)
);

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_users_role      ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_students_dep_id ON students(dep_id);
