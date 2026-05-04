
-- Base users table (all user types share these columns)
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50)     NOT NULL UNIQUE,
    email       VARCHAR(255)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    role        VARCHAR(20)     NOT NULL,   -- enum: STUDENT | TEACHER | ADMIN
    active      BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Students child table (JOINED strategy — FK to users.id)
CREATE TABLE IF NOT EXISTS students (
     user_id     BIGINT          PRIMARY KEY,
    gpa         DECIMAL(3, 2),
    enrollment_date DATE,
    total_credits INT,

    foreign key (user_id) references users(id) on delete cascade
);

-- Teachers child table (JOINED strategy — FK to users.id)
CREATE TABLE IF NOT EXISTS teachers (
    id              BIGINT          PRIMARY KEY,
    office_location   VARCHAR(50),
    salary          DECIMAL(10, 2),
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS admins (
                                      user_id BIGINT PRIMARY KEY,

                                      CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for common lookups
CREATE INDEX idx_users_role      ON users(role);
