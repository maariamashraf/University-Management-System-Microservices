# Academic Core Service

Spring Boot microservice for core academic operations in Uni-System:
- course management
- student enrollment
- department management
- course feedback

## Tech Stack

- Java 25
- Spring Boot 4
- Spring Data JPA
- MySQL
- Kafka
- Eureka Client (service discovery)
- Maven

## Project Structure

- `application/port/in`: use cases and query contracts
- `application/port/out`: repository and publisher ports
- `application/services`: application business services
- `domain/model`: domain entities
- `adapters/in/http`: REST controllers
- `adapters/out/persistence`: JPA adapters, entities, mappers, repositories
- `adapters/Config`: dependency wiring (`BeanConfig`)

## Configuration

Main config file:
- `src/main/resources/application.properties`

Current properties include:
- `spring.application.name=academic-core-service`
- `server.port=8082`
- MySQL datasource config
- Kafka bootstrap servers
- Eureka server URL

## Security Note

`application.properties` currently stores DB credentials directly.
For safer local/dev/prod usage, prefer environment variables, for example:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.kafka.bootstrap-servers=${KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
eureka.client.service-url.defaultZone=${EUREKA_URL:http://localhost:8761/eureka}
```

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

- `POST /create` - create course
- `GET /{id}` - get course by id
- `GET /all` - get all courses
- `GET /teacher/{teacherName}` - get courses by teacher name
- `GET /teacher/{teacherId}` - get courses by teacher id
- `GET /Department/{departmentName}` - get courses by department name

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

- `POST /enroll` - enroll student in course
- `DELETE /drop?studentId={id}&courseId={id}` - drop enrollment
- `GET /student/{studentId}` - list enrollments by student
- `GET /course/{courseId}` - list enrollments by course
- `GET /student/{studentId}/course/{courseId}` - get specific enrollment

Example enroll request:

```json
{
  "studentId": 1001,
  "courseId": 10
}
```

### Departments (`/api/departments`)

- `POST /create` - create department
- `GET /all` - list all departments
- `GET /{id}` - get department by id
- `GET /name/{name}` - find departments by name (case-insensitive)

Example create request:

```json
{
  "id": 1,
  "name": "Computer Science"
}
```

### Feedback (`/api/feedbacks`)

- `POST /` - submit feedback
- `GET /` - get all feedback
- `GET /{id}` - get feedback by id
- `GET /course/{courseId}` - get feedback by course
- `GET /user/{userId}` - get feedback by user

Example submit request:

```json
{
  "id": null,
  "userId": 1001,
  "courseId": 10,
  "comment": "Very useful course content",
  "createdAt": "2026-04-23T10:30:00"
}
```

## Notes and Known Issues

- `GET /api/courses/teacher/{teacherName}` and `GET /api/courses/teacher/{teacherId}` share the same path pattern. This can cause route ambiguity at runtime.
- Course department path currently uses uppercase `Department` in URL: `/api/courses/Department/{departmentName}`.
- Some naming typos exist in code contracts (example: `GetFeedBackQuery`, `FeedbackRepsitoryPort`) but they are currently wired and functional.

## Development Tips

- Keep adapters thin; business rules belong in `application/services` and domain.
- Add tests when changing endpoint behavior or repository queries.
- If you introduce new use cases, register service beans in `adapters/Config/BeanConfig`.
