# IAM Service (Identity & Access Management)

This microservice handles user identities, authentication, authorization, and basic profile management for the University System.

## 🚀 Core Features

1. **Polymorphic User Management (JOINED Inheritance)**
   - **`User` (Base)**: Common details like `username`, `email`, `password`, `role`.
   - **`Student`**: Extends User with `studentNumber`, `department`, and `yearOfStudy`.
   - **`Teacher`**: Extends User with `faculty`, `officeNumber`, and `specialization`.
   - **`Admin`**: Extends User with `adminLevel`.

2. **Authentication & Authorization (Security)**
   - **JWT (JSON Web Tokens)**: Stateless authentication flow.
   - **Role-Based Access Control (RBAC)**: Managed via Spring Security `@PreAuthorize` annotations.
     - `ROLE_ADMIN`: Full system access.
     - `ROLE_TEACHER`: Read access to students and course rosters.
     - `ROLE_STUDENT`: Access to their own profile and courses.

3. **Course Enrollment System**
   - Manages Many-to-Many relationships between users and courses.
   - API to enroll users, remove users, and query participants of a course.

4. **Database Migrations (Flyway)**
   - Replaced automatic Hibernate DDL generation (`ddl-auto=update`) with **Flyway** for reliable schema versioning.
   - Schema defined in `src/main/resources/db/migration/`.

5. **Cross-Cutting Logging (Spring AOP)**
   - Implemented `LoggingAspect` using Spring AOP to automatically log method entry, exit, and execution times across the service layer without cluttering business logic.

6. **Global Exception Handling**
   - Centralized `GlobalExceptionHandler` using `@RestControllerAdvice`.
   - Handles custom exceptions (`UserNotFoundException`, `UserAlreadyExistsException`, `AlreadyEnrolledException`) and validation errors gracefully, returning structured JSON responses.

## 🛠 Tech Stack

- **Java 17 (or 21)**
- **Spring Boot 3.3.4**
- **Spring Cloud 2023.0.3**
- **Spring Security + JJWT (0.11.5)** for security and token generation.
- **Spring Data JPA / Hibernate** for Object-Relational Mapping.
- **MySQL 8.0** as the relational database.
- **Flyway** for database migrations.
- **Spring Cloud Netflix Eureka** for service discovery.
- **Spring AOP** for aspect-oriented programming (logging).
- **Spring Boot Actuator** for health checks.
- **Lombok** to reduce Java boilerplate.

## 📁 Project Architecture

- **`controller/`**: Exposes the REST APIs (`AuthController`, `UserController`). Validates inputs and delegates to services.
- **`service/`**: Contains the core business logic (`AuthService`, `UserServiceImpl`).
- **`repository/`**: Spring Data JPA interfaces for database operations.
- **`entity/`**: JPA domain models mapping to database tables.
- **`dto/`**: Data Transfer Objects (`request/` and `response/`) to decouple the API contract from the internal entities.
- **`security/`**: JWT utilities, authentication filters, and user details services.
- **`aop/`**: Aspect-oriented programming components.
- **`exception/`**: Custom exceptions and the global handler.

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new User. **Note: ADMIN role requires existing ADMIN auth.** | Public* |
| POST | `/api/auth/login` | Authenticate and retrieve JWT (returns `token`, `userId`, `username`) | Public |
| POST | `/api/auth/refresh` | Renew an existing valid JWT | Authenticated |

### User Management
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/users/me` | Get currently authenticated user's profile | Authenticated |
| GET | `/api/users/{id}` | Get user by ID | Admin Only |
| GET | `/api/users` | Get all users | Admin Only |
| GET | `/api/users/students` | Get all students | Admin, Teacher |
| GET | `/api/users/students/department/{dept}` | Filter students by department | Admin, Teacher |
| GET | `/api/users/teachers` | Get all teachers | Admin Only |
| PUT | `/api/users/{id}` | Update a user's profile | Admin Only |
| DELETE | `/api/users/{id}` | Delete a user | Admin Only |

### Course Enrollment
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/users/enroll` | Enroll a user in a course | Admin |
| DELETE | `/api/users/{userId}/courses/{courseId}` | Remove user from a course | Admin |
| GET | `/api/users/course/{courseId}` | Get all users enrolled in a course | Admin, Teacher |
| GET | `/api/users/{userId}/courses` | Get all course IDs for a user | Admin Only |

## 🛡 Security & Rate Limiting

- **Rate Limiting**: Applied at the API Gateway level using Redis. Auth endpoints are limited to 10 requests/sec with a burst capacity of 20 to prevent brute-force attacks.
- **JWT Secret**: Managed via environment variables (`JWT_SECRET`). Plaintext fallbacks are disabled for security.
- **Admin Guard**: The system prevents unauthorized creation of Admin accounts by requiring an existing Admin to be authenticated for any `ROLE_ADMIN` registration request.

## ⚙️ Running Locally

1. **Database Setup**: 
   Ensure MySQL is running locally on port `3306`.
   Create the database:
   ```sql
   CREATE DATABASE helwanuni;
   ```

2. **Environment Variables**: 
   Create a `.env` file in the root directory (or set env vars):
   ```env
   JWT_SECRET=your_super_secret_key_here
   ```

3. **Start the Application**: 
   Run the `IamServiceApplication.java` main class or use Maven:
   ```bash
   mvn spring-boot:run
   ```
   *Note: Flyway will automatically execute all SQL scripts in `db/migration/` on startup to initialize the database tables.*
