# Docker and Kafka Implementation Guide

This document provides a comprehensive explanation of how **Docker** and **Kafka** are implemented within the University Management System microservices architecture. It covers theoretical concepts, practical code logic, and the role of each component.

---

## 1. Docker Implementation

The project relies heavily on Docker to containerize services, ensure consistent development environments, and easily orchestrate the entire microservices ecosystem using `docker-compose.yml`.

### The `docker-compose.yml` Architecture
The Docker Compose file orchestrates three main layers:
1. **Infrastructure**: Zookeeper, Kafka, Redis, and a Kafka UI.
2. **Databases**: A shared MySQL database (`shared-db`) and an initialization container (`db-init`) to run startup SQL scripts.
3. **Microservices (Backend & Frontend)**: Eureka Discovery Server, API Gateway, IAM Service, Academic Core, Communication Service, and the Vite Frontend. 

The Compose file heavily utilizes **Docker volumes** (like `maven-cache` and `redis-data`) to persist data and speed up builds. It also leverages `depends_on` with `condition: service_healthy` to ensure services start in the correct order (e.g., microservices wait for the database and Kafka to be healthy before starting).

### Backend Dockerfiles (Java/Spring Boot)
Each Java microservice (e.g., `academic-core-Service`, `iam-service`) uses an identical lightweight Dockerfile tailored for **development with hot-reloading**:

```dockerfile
FROM maven:3.9.6-eclipse-temurin-21
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
CMD ["mvn", "spring-boot:run"]
```
**Explanation**:
* `FROM maven...`: Uses an official Maven image with JDK 21.
* `RUN mvn dependency:go-offline`: Caches Maven dependencies in the image layer so they aren't re-downloaded every time the code changes.
* `CMD ["mvn", "spring-boot:run"]`: Starts the application using Spring Boot's run command. Combined with `spring-boot-devtools` and volume mapping in `docker-compose.yml` (`- ./Backend/service-name:/app`), this enables real-time hot-reloading when source files are changed.

### Frontend Dockerfile (Vite/React)
The frontend uses a similar hot-reloading strategy:
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV CHOKIDAR_USEPOLLING=true
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
```
**Explanation**:
* `FROM node:22-alpine`: A lightweight Node.js image.
* `RUN npm ci`: Installs dependencies reliably based on the lockfile.
* `ENV CHOKIDAR_USEPOLLING=true`: Critical for Docker on Windows/Mac, ensuring Vite correctly detects file changes through the volume mount.
* `CMD`: Runs the Vite development server, binding to `0.0.0.0` so it is accessible from the host machine.

---

## 2. Kafka Implementation

### Theoretical Concepts (Event-Driven Architecture)
Kafka is an event-streaming platform used here to implement an **Event-Driven Architecture (EDA)**. Instead of microservices making synchronous HTTP calls to each other (which creates tight coupling and potential bottlenecks), they communicate asynchronously via **events**.

* **Producer**: A service that publishes an event when something happens (e.g., `Academic Core` publishes a `StudentEnrolled` event).
* **Topic**: A named channel where events are categorized (e.g., `student-enrolled`, `announcement-created`).
* **Consumer**: A service that listens to a topic and reacts when an event arrives (e.g., `Communication Service` listens to `student-enrolled` to send a welcome email).

**Why use Kafka here?**
1. **Decoupling**: The Academic Core doesn't need to know *how* or *if* notifications are sent; it just announces that a student enrolled.
2. **Resilience**: If the Communication Service is down, Kafka stores the events. Once the service is back up, it will consume the pending events, ensuring no notifications are lost.

### Code Implementation

#### 1. Configuration (`application.properties` & Beans)
Both producing and consuming services define connection properties targeting the Kafka broker (`kafka:29092` inside the Docker network).
Producers configure a `StringSerializer` for keys and `JsonSerializer` for values.
Consumers configure a `StringDeserializer` and `JsonDeserializer` (often falling back to a `Map<String, Object>` representation to avoid strict class dependency between services).

#### 2. The Producer logic (`academic-core-Service`)
In the Academic Core service, Kafka acts as an output adapter in the Hexagonal Architecture.

```java
@Component
@RequiredArgsConstructor
public class KafkaEventPublisher implements EventPublisherPort {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void publishStudentEnrolled(StudentEnrollend event) {
        String key = event.studentId();
        kafkaTemplate.send(KafkaTopics.STUDENT_ENROLLED, key, event)
                .thenAccept(result -> log.info("Published StudentEnrolled..."));
    }
}
```
**Logic**: 
* The domain triggers an interface (`EventPublisherPort`).
* `KafkaEventPublisher` implements this interface.
* It uses Spring's `KafkaTemplate` to serialize the Java Object (`StudentEnrollend`) into JSON and send it to the `student-enrolled` topic.

#### 3. The Consumer logic (`communication-service`)
The Communication Service is solely dedicated to listening and dispatching notifications.

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumer {
    private final NotificationService notificationService;

    @KafkaListener(topics = "student-enrolled", groupId = "communication-group")
    public void onStudentEnrolled(Map<String, Object> event) {
        try {
            Long studentId = toLong(event.get("studentId"));
            String courseName = String.valueOf(event.get("courseName"));

            NotificationRequest request = NotificationRequest.builder()
                    .recipientId(studentId)
                    .title("Enrollment Confirmed ✅")
                    .message("You have successfully enrolled in \"" + courseName + "\".")
                    .type(NotificationType.ENROLLMENT)
                    .build();

            notificationService.sendNotificationToUser(request);
        } catch (Exception e) {
            log.error("Error handling event...", e);
        }
    }
}
```
**Logic**:
* `@KafkaListener` marks the method as a consumer for the `student-enrolled` topic.
* When Academic Core sends an event, Spring Kafka automatically pulls it, deserializes the JSON into a `Map<String, Object>`, and invokes this method.
* The consumer extracts the required data (`studentId`, `courseName`), constructs a `NotificationRequest`, and passes it to the `NotificationService` which ultimately handles the Email/WebSocket push to the user.


### Auto-Initialization (`kafka-init`)
The `docker-compose.yml` includes a specific container named `kafka-init`. Its only job is to wait for the Kafka broker to start and then automatically create the necessary topics (`student-enrolled`, `course-created`, `announcement-created`, `notification-push`). This guarantees that consumers and producers won't fail due to missing topics on the first run.

---

## 3. How to Trace Message Flows

Tracing an event from the producer to the consumer is essential for debugging. Here is how you can track the lifecycle of a Kafka message in this system.

### A. Visual Tracing (Kafka UI)
The easiest way to see what's happening in Kafka is through the built-in UI:
1.  Open your browser and navigate to **`http://localhost:8090`**.
2.  Go to the **Topics** section.
3.  Click on a topic (e.g., `student-enrolled`).
4.  Go to the **Messages** tab and click **"Seek to End"** or **"New Messages"** to see live events as they arrive.
5.  You can inspect the JSON payload of each message to verify its content.

### B. Log-based Tracing (AOP & Manual Logs)
Both the producer and consumer services are configured to log their activities.

#### 1. Tracking the Producer (`academic-core-service`)
When an event is published, you will see a log entry in the `academic-core` container:
```text
Published StudentEnrolled → topic=student-enrolled partition=0 offset=12 key=STUD-123
```
This confirms the message successfully reached the Kafka broker.

#### 2. Tracking the Consumer (`communication-service`)
The `communication-service` uses **Aspect-Oriented Programming (AOP)** to automatically log all Kafka interactions. Look for these markers in the logs:
*   **Method Entry**: `▶ [KAFKA] Event received by: KafkaConsumer.onStudentEnrolled()`
*   **Data Content**: `Received student-enrolled event: {studentId=123, courseName=Java 101}`
*   **Service Processing**: `▶ [SERVICE] Calling: NotificationServiceImpl.sendNotificationToUser()`
*   **Completion**: `✅ [SERVICE] Completed: NotificationServiceImpl.sendNotificationToUser()`

### C. Example Flow: Student Enrollment
If a student enrolls in a course, the flow looks like this:
1.  **Academic Core**: Saves the enrollment in MySQL.
2.  **Academic Core**: `KafkaEventPublisher` sends a JSON event to Kafka.
3.  **Kafka UI**: You see the message appear in the `student-enrolled` topic.
4.  **Communication Service**: `KafkaConsumer` picks up the message.
5.  **AOP Logs**: You see the `▶ [KAFKA]` and `▶ [SERVICE]` logs in the Communication Service console.
6.  **End Result**: The notification is saved/sent, and you see `✅ [SERVICE] Completed`.

By following these logs and checking the UI, you can pinpoint exactly where a message might be stuck or failing.
