# Academic Core Service

Spring Boot microservice for core academic operations in Uni-System:
- Course management
- Student enrollment
- Department management
- Announcements
- Course feedback

## Tech Stack

- Java 21
- Spring Boot 3.3.4
- Spring Data JPA
- Spring Cache (Redis)
- Spring AOP
- MySQL
- Flyway (schema migrations)
- Kafka (event publishing)
- Eureka Client (service discovery)
- Maven

## Project Structure

```
src/main/java/com/unisystem/academic_core_service/
├── domain/
│   ├── application/
│   │   ├── port/in/          # Use case & query interfaces
│   │   ├── port/out/         # Repository & event publisher ports
│   │   └── services/         # Application business services
│   ├── events/               # Kafka event payload models
│   ├── exceptions/           # Domain exception hierarchy
│   └── model/                # Domain entities & value objects
└── infrastructure/
    ├── adapters/
    │   ├── ExcepHandler/     # Global exception handler (@RestControllerAdvice)
    │   ├── in/http/          # REST controllers & DTOs
    │   └── out/
    │       ├── kafka/        # Kafka producer adapter & config
    │       └── persistence/  # JPA adapters, entities, mappers, repositories
    ├── aop/
    │   ├── annotations/      # @AuditLog, @TeachersOnly, @CourseTeacherOnly
    │   └── aspects/          # AOP aspect implementations
    └── config/               # BeanConfig, CacheConfig
```

## Configuration

Main config file: `src/main/resources/application.properties`

Key properties:
- `spring.application.name=academic-core-service`
- `server.port=8082`
- MySQL datasource config
- Redis connection config
- Kafka bootstrap servers
- Eureka server URL

**Security note**: For production, prefer environment variables:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.kafka.bootstrap-servers=${KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
eureka.client.service-url.defaultZone=${EUREKA_URL:http://localhost:8761/eureka}
spring.data.redis.host=${REDIS_HOST:localhost}
```

## Domain Exception Hierarchy

All domain errors are typed exceptions that extend `RuntimeException` and are mapped centrally to HTTP responses by the global handler. No try/catch blocks are needed in controllers.

| Exception | HTTP Status | When Thrown |
|---|---|---|
| `CourseNotFoundException` | `404 Not Found` | Course lookup by ID returns empty |
| `AlreadyEnrolledException` | `409 Conflict` | Student is already enrolled in the course |
| `DuplicateCourseException` | `409 Conflict` | Course creation with an already-existing course code |
| `InvalidEnrollmentException` | `400 Bad Request` | Enrollment not found during drop; invalid enrollment lookup |
| `IllegalArgumentException` | `400 Bad Request` | Invalid input (e.g. end date before start date) |
| `Exception` (fallback) | `500 Internal Server Error` | Any other unhandled exception |

## Global Exception Handler

`GlobalExceptionHandler` lives in `infrastructure/adapters/ExcepHandler/` and is annotated with `@RestControllerAdvice`. It intercepts all exceptions thrown from any controller and returns a consistent JSON error body:

```json
{
  "timestamp": "2026-05-03T13:00:00.123",
  "status": 404,
  "error": "Not Found",
  "message": "Course with ID 99 was not found"
}
```

## Caching Strategy (Redis)

Caching uses Spring Cache annotations backed by Redis with a 10-minute TTL. All cache names are defined as constants in `CacheConfig`.

### Read-through (`@Cacheable`)

| Cache Name | Key | Service Method |
|---|---|---|
| `coursesAll` | — | `GetCoursesService.findAll()` |
| `coursesById` | `courseId` | `GetCoursesService.findById()` |
| `coursesByTeacherName` | `teacherName` | `GetCoursesService.findByTeacherName()` |
| `coursesByTeacherId` | `teacherId` | `GetCoursesService.findByTeacherId()` |
| `coursesByName` | `courseName` | `GetCoursesService.findByCourseName()` |
| `coursesByDepartment` | `departmentName` | `GetCoursesService.findByDepartmentName()` |
| `coursesPopular` | `topN` | `GetCoursesService.findPopular()` |
| `enrollmentsByStudent` | `studentId` | `GetEnrollmentsService.getEnrollmentsByStudentId()` |
| `enrollmentsByCourse` | `courseId` | `GetEnrollmentsService.getEnrollmentsByCourseId()` |
| `enrollmentByStudentCourse` | `studentId + '-' + courseId` | `GetEnrollmentsService.getEnrollment()` |
| `enrollmentsAll` | — | `GetEnrollmentsService.getAllEnrollments()` |
| `announcementsByCourse` | `courseId` | `GetAnnouncementsService.getAnnouncementsByCourseId()` |
| `feedbackByCourse` | `courseId` | `GetFeedbackService.getFeedbacksByCourseId()` |
| `feedbackByUser` | `userId` | `GetFeedbackService.getFeedbacksByUserId()` |
| `feedbackById` | `id` | `GetFeedbackService.getFeedbackById()` |
| `feedbackAll` | — | `GetFeedbackService.getAllFeedbacks()` |

### Cache Eviction (`@CacheEvict` / `@Caching`)

Eviction runs on every mutating operation to prevent stale reads:

| Mutating Operation | Caches Evicted |
|---|---|
| `CreateCourseService.create()` | All 7 course caches |
| `EnrollStudentService.enroll()` | All 4 enrollment caches + all 7 course caches |
| `EnrollStudentService.drop()` | All 4 enrollment caches + all 7 course caches |
| `CreateAnnouncementService.create()` | `announcementsByCourse` (targeted by `courseId` key) |
| `SubmitFeedbackService.submit()` | All 4 feedback caches |

## AOP Aspects

| Annotation | Aspect | Behavior |
|---|---|---|
| `@TeachersOnly` | `TeachersOnlyAspect` | Restricts endpoint to users with the teacher role (via request header) |
| `@CourseTeacherOnly` | `CourseTeacherOnlyAspect` | Restricts endpoint to the teacher who owns the specific course |
| `@AuditLog` | `AuditLogAspect` | Logs the action and user identity to the audit log |

## Run Locally

From `academic-core-Service`:

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

Or build and run jar:

```bash
./mvnw clean package
java -jar target/academic-core-service-0.0.1-SNAPSHOT.jar
```

## API Endpoints

Base URL (local): `http://localhost:8082`

### Courses (`/api/courses`)

| Method | Path | Description | Auth |
|---|---|---|---|
| `POST` | `/create` | Create a new course | Teachers only (`@TeachersOnly`) |
| `GET` | `/{id}` | Get course by ID | — |
| `GET` | `/all` | Get all courses | — |
| `GET` | `/teacher/{teacherName}` | Get courses by teacher name | — |
| `GET` | `/teacher/{teacherId}` | Get courses by teacher ID | — |
| `GET` | `/Department/{departmentName}` | Get courses by department | — |

Example create request:

```json
{
  "name": "Software Architecture",
  "courseCode": "SA-401",
  "description": "Advanced architecture concepts",
  "startDate": "2026-03-01",
  "endDate": "2026-06-30",
  "credits": 3,
  "maxStudents": 120,
  "departmentId": 1,
  "teacherId": 101
}
```

### Enrollments (`/api/enrollments`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/enroll` | Enroll student in course |
| `DELETE` | `/drop?studentId={id}&courseId={id}` | Drop enrollment |
| `GET` | `/student/{studentId}` | List enrollments by student |
| `GET` | `/course/{courseId}` | List enrollments by course |
| `GET` | `/student/{studentId}/course/{courseId}` | Get specific enrollment |

Example enroll request:

```json
{
  "studentId": 1001,
  "courseId": 10
}
```

### Departments (`/api/departments`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/create` | Create department |
| `GET` | `/all` | List all departments |
| `GET` | `/{id}` | Get department by ID |
| `GET` | `/name/{name}` | Find departments by name |

### Announcements (`/api/announcements`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/` | Create announcement for a course |
| `GET` | `/course/{courseId}` | Get announcements for a course |

### Feedback (`/api/feedbacks`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/` | Submit feedback |
| `GET` | `/` | Get all feedback |
| `GET` | `/{id}` | Get feedback by ID |
| `GET` | `/course/{courseId}` | Get feedback by course |
| `GET` | `/user/{userId}` | Get feedback by user |

## Known Issues

- `GET /api/courses/teacher/{teacherName}` and `GET /api/courses/teacher/{teacherId}` share the same URL path pattern — route ambiguity at runtime. Consider `/by-name/{name}` vs `/by-id/{id}`.
- Course department path uses uppercase `Department` in URL — should be lowercase for REST convention.
- Naming typos remain in some interfaces (`GetFeedBackQuery`, `FeedbackRepsitoryPort`, `StudentEnrollend`) — functional but should be cleaned up.

## Development Tips

- Keep controllers thin — delegate all logic to use case interfaces.
- All business exceptions must live in the `domain/exceptions` package to be picked up by `GlobalExceptionHandler`.
- When adding new write operations, always add `@CacheEvict` (or `@Caching`) on the appropriate caches.
- Register new service beans in `infrastructure/config/BeanConfig`.
