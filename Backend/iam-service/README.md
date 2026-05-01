# IAM Service — Identity & Access Management

> **Microservice** · Spring Boot 3.2.0 · Java 17 · MySQL 8 · Port `8081`

The IAM service is the single source of truth for **user identity, authentication, and authorization** in the University Management System. Every other microservice trusts the JWT tokens issued here, and the API Gateway validates them before forwarding requests downstream.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Database Schema](#database-schema)
4. [Security Model](#security-model)
5. [API Reference](#api-reference)
6. [Project Structure](#project-structure)
7. [Key Implementation Details](#key-implementation-details)
8. [Running Locally](#running-locally)
9. [Running with Docker](#running-with-docker)
10. [Environment Variables](#environment-variables)

---

## Architecture Overview

```
Client
  │
  ▼
API Gateway (port 8080)
  │  validates JWT on every request
  │  routes /api/auth/**, /api/users/**, /api/students/**, /api/teachers/** → IAM Service
  │
  ▼
IAM Service (port 8081)
  │
  ├── Spring Security + JWT (issues & validates tokens)
  ├── Spring Data JPA + Flyway (schema management)
  ├── MySQL shared-db (helwanuni database)
  └── Eureka Client (registers as IAM-SERVICE)
```

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Runtime |
| Spring Boot | 3.2.0 | Application framework |
| Spring Security | 6.x | Authentication & authorization |
| JJWT | 0.11.5 | JWT generation & validation |
| Spring Data JPA / Hibernate | 6.x | ORM |
| Flyway | 9.x | Database schema migrations |
| MySQL | 8.0 | Shared relational database |
| Spring Cloud Eureka Client | 2023.0.0 | Service discovery |
| Spring AOP | 6.x | Cross-cutting logging |
| Spring Boot Actuator | 3.2.0 | Health checks & metrics |
| Lombok | Latest | Boilerplate reduction |

---

## Database Schema

Schema is fully managed by **Flyway** — Hibernate is set to `validate` mode only. Tables are created/migrated automatically on startup.

### Tables

#### `users` — Base table (JOINED inheritance)
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT AUTO_INCREMENT PK | |
| `username` | VARCHAR(50) UNIQUE NOT NULL | |
| `email` | VARCHAR(255) UNIQUE NOT NULL | |
| `password` | VARCHAR(255) NOT NULL | BCrypt hashed |
| `user_type` | VARCHAR(31) NOT NULL | Discriminator: `STUDENT` / `TEACHER` / `ADMIN` |
| `role` | VARCHAR(20) NOT NULL | Enum: `STUDENT` / `TEACHER` / `ADMIN` |
| `created_at` | TIMESTAMP | Auto-set on insert |
| `updated_at` | TIMESTAMP | Auto-set on update |

#### `students` — Child table (FK → users.id)
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT PK FK | Cascade delete from users |
| `student_number` | VARCHAR(50) UNIQUE | |
| `department` | VARCHAR(100) | |
| `year_of_study` | INT | |

#### `teachers` — Child table (FK → users.id)
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT PK FK | Cascade delete from users |
| `faculty` | VARCHAR(100) | |
| `office_number` | VARCHAR(50) | |
| `specialization` | VARCHAR(150) | |

#### `admins` — Child table (FK → users.id)
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT PK FK | Cascade delete from users |
| `admin_level` | VARCHAR(50) | |

#### `course_enrollments` — Join table
| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT AUTO_INCREMENT PK | |
| `user_id` | BIGINT FK → users.id | Cascade delete |
| `course_id` | BIGINT | Logical ref — no DB FK (cross-service) |
| `enrolled_at` | TIMESTAMP | Auto-set on insert |

> **Note:** `course_id` has no database-level foreign key because course data lives in the `academic-core` service. The reference is intentionally kept logical.

### Flyway Migration History

| Version | File | Description |
|---|---|---|
| V1 | `V1__init_users.sql` | Creates `users`, `students`, `teachers` tables + indexes |
| V2 | `V2__add_course_enrollment.sql` | Creates `course_enrollments` table |
| V3 | `V3__add_admin_table.sql` | Creates `admins` table, migrates misclassified admin rows |

---

## Security Model

### JWT Flow

```
1. POST /api/auth/register  →  user created, JWT returned
2. POST /api/auth/login     →  credentials verified, JWT returned
3. All subsequent requests  →  "Authorization: Bearer <token>" header required
4. JwtAuthFilter intercepts every request, validates token, sets SecurityContext
```

### Token Contents (Claims)

```json
{
  "sub": "username",
  "roles": "ROLE_STUDENT",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Role-Based Access Control (RBAC)

Enforced via Spring Security `@PreAuthorize` on each endpoint:

| Role | Permissions |
|---|---|
| `ROLE_ADMIN` | Full access to all endpoints |
| `ROLE_TEACHER` | Read students, filter by department/year, view course rosters |
| `ROLE_STUDENT` | Read & update their own profile, view their own courses |

---

## API Reference

### Authentication — `/api/auth` (Public)

| Method | Endpoint | Body | Response | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | `RegisterRequest` | `201 + AuthResponse` | Register a new user |
| `POST` | `/api/auth/login` | `LoginRequest` | `200 + AuthResponse` | Authenticate and get JWT |

**RegisterRequest example:**
```json
{
  "username": "john_doe",
  "email": "john@uni.edu",
  "password": "secret123",
  "role": "STUDENT",
  "studentNumber": "S2024001",
  "department": "Computer Science",
  "yearOfStudy": 2
}
```

**AuthResponse example:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "john_doe",
  "role": "STUDENT"
}
```

---

### User Management — `/api/users`

> All endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users` | Admin | Get all users |
| `GET` | `/api/users/{id}` | Admin or Self | Get user by ID |
| `GET` | `/api/users/role/{role}` | Admin | Get all users by role |
| `PUT` | `/api/users/{id}` | Admin or Self | Partial update of user profile |
| `DELETE` | `/api/users/{id}` | Admin | Delete a user permanently |

---

### Student Endpoints — `/api/users/students`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users/students` | Admin, Teacher | Get all students |
| `GET` | `/api/users/students/department/{dept}` | Admin, Teacher | Filter students by department |
| `GET` | `/api/users/students/year/{year}` | Admin, Teacher | Filter students by year of study |

---

### Teacher Endpoints — `/api/users/teachers`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users/teachers` | Admin | Get all teachers |
| `GET` | `/api/users/teachers/faculty/{faculty}` | Admin | Filter teachers by faculty |

---

### Course Enrollment — `/api/users`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/users/enroll` | Admin | Enroll a user in a course |
| `DELETE` | `/api/users/{userId}/courses/{courseId}` | Admin | Remove user from a course |
| `GET` | `/api/users/course/{courseId}` | Admin, Teacher | Get all users in a course |
| `GET` | `/api/users/{userId}/courses` | Admin or Self | Get all course IDs for a user |

**EnrollmentRequest example:**
```json
{
  "userId": 5,
  "courseId": 12
}
```

---

## Project Structure

```
src/main/java/com/uni/iam/
│
├── IamServiceApplication.java         # Entry point
│
├── controller/
│   ├── AuthController.java            # POST /api/auth/register, /login
│   └── UserController.java            # All /api/users/** endpoints
│
├── service/
│   ├── AuthService.java               # Registration & login logic
│   ├── UserService.java               # Interface
│   └── UserServiceImpl.java           # CRUD + enrollment business logic
│
├── repository/
│   ├── UserRepository.java
│   ├── StudentRepository.java
│   ├── TeacherRepository.java
│   └── CourseEnrollmentRepository.java
│
├── entity/
│   ├── User.java                      # Base entity (JOINED inheritance)
│   ├── Student.java                   # Discriminator value: STUDENT
│   ├── Teacher.java                   # Discriminator value: TEACHER
│   ├── Admin.java                     # Discriminator value: ADMIN
│   ├── CourseEnrollment.java          # Enrollment join table
│   └── Role.java                      # Enum: STUDENT | TEACHER | ADMIN
│
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── UpdateUserRequest.java
│   │   └── CourseEnrollmentRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── UserResponse.java
│       ├── StudentResponse.java
│       ├── TeacherResponse.java
│       └── CourseUsersResponse.java
│
├── security/
│   ├── JwtUtils.java                  # Token generation & validation
│   ├── JwtAuthFilter.java             # OncePerRequestFilter — validates Bearer token
│   ├── UserDetailsServiceImpl.java    # Loads user from DB for Spring Security
│   └── CustomUserDetails.java         # UserDetails wrapper
│
├── config/
│   └── SecurityConfig.java            # Security filter chain, BCrypt, RBAC config
│
├── aop/
│   └── LoggingAspect.java             # AOP: logs method entry/exit + execution time
│
└── exception/
    ├── GlobalExceptionHandler.java    # @RestControllerAdvice
    ├── UserNotFoundException.java
    ├── UserAlreadyExistsException.java
    └── AlreadyEnrolledException.java

src/main/resources/
├── application.properties             # Local dev config
└── db/migration/
    ├── V1__init_users.sql             # users, students, teachers tables
    ├── V2__add_course_enrollment.sql  # course_enrollments table
    └── V3__add_admin_table.sql        # admins table + data migration
```

---

## Key Implementation Details

### JOINED Table Inheritance
Users are stored across multiple tables. The `users` table holds shared fields; `students`, `teachers`, and `admins` each hold type-specific columns. Hibernate joins them on query automatically using the `user_type` discriminator column.

### AOP Logging
`LoggingAspect` intercepts all methods in the `service` package. It logs:
- Method name and arguments on entry
- Return value and execution time (ms) on exit
- Exception details on failure

This keeps all logging out of business logic.

### Global Exception Handling
`GlobalExceptionHandler` catches all custom exceptions and maps them to structured JSON responses:

```json
{
  "status": 404,
  "error": "User Not Found",
  "message": "No user found with id: 99"
}
```

### Stateless Security
The service is fully stateless — no HTTP sessions. Every request must carry a valid JWT. The `JwtAuthFilter` extracts and validates the token, then sets the `SecurityContext` for the duration of the request.

---

## Running Locally

**Prerequisites:** Java 17, Maven, MySQL 8 running on `localhost:3306`

```bash
# 1. Ensure the database exists
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS helwanuni;"

# 2. Run the service
cd Backend/iam-service
mvn spring-boot:run
```

Flyway will automatically run all migration scripts on startup.
Service will be available at: `http://localhost:8081`

---

## Running with Docker

The service is included in the root `docker-compose.yml`:

```bash
# From the project root — starts the core stack (excludes frontend/communication-service)
docker compose up --build eureka-server api-gateway shared-db iam-service
```

The IAM service waits for `shared-db` and `eureka-server` to be healthy before starting.

---

## Environment Variables

These are set automatically by `docker-compose.yml`. For local dev, defaults in `application.properties` apply.

| Variable | Default | Description |
|---|---|---|
| `SERVER_PORT` | `8081` | Service port |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3306/helwanuni` | DB connection |
| `SPRING_DATASOURCE_USERNAME` | `root` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | *(set in compose)* | DB password |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `validate` | Flyway owns schema |
| `SPRING_KAFKA_BOOTSTRAP_SERVERS` | `localhost:9092` | Kafka broker |
| `SPRING_KAFKA_CONSUMER_GROUP_ID` | `iam-group` | Kafka consumer group |
| `JWT_SECRET` | `mySuperSecretKey2026UniSystemXYZ!` | ⚠️ Change in production |
| `JWT_EXPIRATION_MS` | `86400000` | Token TTL (24 hours) |
| `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE` | `http://localhost:8761/eureka` | Eureka server URL |
