# 📡 Communication Service — Person 4

## Architecture: Layered + SOLID Principles

```
┌──────────────────────────────────────────┐
│  Controller Layer                        │  ← HTTP routing only
│  NotificationController, MessageController│
└──────────────┬───────────────────────────┘
               │ calls interface (DIP)
┌──────────────▼───────────────────────────┐
│  Service Layer (Interface + Impl)        │  ← All business logic
│  NotificationService / NotificationServiceImp │
│  MessageService / MessageServiceImp      │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│  Repository Layer                        │  ← DB access only
│  NotificationRepository, MessageRepository│
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│  MySQL Database (shared: helwanuni)      │
└──────────────────────────────────────────┘
```

## SOLID Principles Applied

| Principle | How |
|---|---|
| **S** — Single Responsibility | Each class has one job |
| **O** — Open/Closed | Interfaces allow extension without modification |
| **L** — Liskov Substitution | Impl classes are fully substitutable for interfaces |
| **I** — Interface Segregation | Separate NotificationService and MessageService interfaces |
| **D** — Dependency Inversion | Controllers depend on interfaces, not implementations |

## Package Structure (aligned with `com.unisystem.*`)

Root: **`com.unisystem.communication`**

```
com.unisystem.communication
├── CommunicationServiceApplication.java
├── controller/
│   ├── NotificationController.java
│   └── MessageController.java
├── service/
│   ├── NotificationService.java
│   ├── MessageService.java
│   └── impl/
│       ├── NotificationServiceImp.java
│       └── MessageServiceImp.java
├── mapper/
│   ├── NotificationMapper.java
│   └── MessageMapper.java
├── persistence/
│   ├── entity/
│   │   ├── Notification.java
│   │   ├── Message.java
│   │   ├── NotificationType.java
│   │   ├── User.java                   ← stub (shared table)
│   │   ├── Course.java                 ← stub (shared table)
│   │   └── EnrolledCourse.java         ← stub (shared table)
│   ├── repository/
│   │   ├── NotificationRepository.java
│   │   ├── MessageRepository.java
│   │   ├── UserRepository.java
│   │   └── CourseRepository.java
│   └── dto/
│       ├── notification/user/
│       │   ├── NotificationRequest.java
│       │   └── NotificationResponse.java
│       ├── notification/course/
│       │   └── NotificationCourseRequest.java
│       └── message/
│           ├── MessageRequest.java
│           └── MessageResponse.java
├── messaging/
│   └── KafkaConsumer.java             ← listens to Kafka topics from compose/init
├── config/
│   ├── WebSocketConfig.java
│   └── SwaggerConfig.java
├── security/
│   ├── jwt/JwtService.java
│   ├── jwt/JwtAuthFilter.java
│   ├── websocket/WebSocketAuthInterceptor.java
│   └── SecurityConfig.java
└── exception/
    ├── ResourceNotFoundException.java
    └── GolbalHandler.java
```

## Kafka Topics

| Topic | From | Action |
|---|---|---|
| `user-registered` | IAM Service | Send welcome notification |
| `student-enrolled` | Academic Core | Send enrollment confirmation |
| `announcement-created` | Academic Core | Fan-out to all enrolled students |
| `course-created` | Academic Core | Logged only |
| `notification-push` | Any Service | Generic push to a specific user |

## WebSocket Channels

| Channel | Usage |
|---|---|
| `/user/{email}/queue/notifications` | Personal notifications per user |
| `/topic/course/{courseId}` | Course chat broadcast |

## API Port: 8083
## Swagger: http://localhost:8083/swagger-ui.html

## How to Run

```bash
# 1. Make sure the main docker-compose is running
docker-compose up -d

# 2. Run this service
mvn spring-boot:run
```

## Important Notes for Team

- Port: **8083** (matches project convention)
- Database: **helwanuni** (same as all other services)
- JWT Secret: must match IAM Service secret in `application.properties`
- Security is enabled — get a JWT token from IAM Service first, then use it as `Bearer {token}` in Swagger
