-- ============================================================
-- V3 — Add Admin Table and Fix Data
-- MySQL-compatible version
-- ============================================================

-- 1. Create the dedicated admins table (JOINED inheritance)
CREATE TABLE IF NOT EXISTS admins (
    id          BIGINT          NOT NULL,
    admin_level VARCHAR(50),
    PRIMARY KEY (id),
    CONSTRAINT fk_admins_users FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Migrate existing admins that were accidentally saved as students
INSERT INTO admins (id)
SELECT u.id FROM users u WHERE u.role = 'ADMIN' AND u.user_type = 'STUDENT';

-- 3. Delete them from the students table
DELETE FROM students
WHERE id IN (SELECT id FROM users WHERE role = 'ADMIN' AND user_type = 'STUDENT');

-- 4. Correct the discriminator column in the base users table
UPDATE users
SET user_type = 'ADMIN'
WHERE role = 'ADMIN' AND user_type = 'STUDENT';
