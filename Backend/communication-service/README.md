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

## Package Structure (matches project)

```
UnitSystem.demo
├── Controllers/
│   ├── NotificationController.java
│   └── MessageController.java
├── BusinessLogic/
│   ├── InterfaceServiceLayer/
│   │   ├── NotificationService.java    ← interface (DIP)
│   │   └── MessageService.java         ← interface (DIP)
│   ├── ImpServiceLayer/
│   │   ├── NotificationServiceImp.java ← business logic + Redis cache
│   │   └── MessageServiceImp.java      ← business logic + Redis cache
│   └── Mappers/
│       ├── NotificationMapper.java     ← entity ↔ DTO mapping
│       └── MessageMapper.java          ← entity ↔ DTO mapping
├── DataAccessLayer/
│   ├── Entities/
│   │   ├── Notification.java
│   │   ├── Message.java
│   │   ├── NotificationType.java
│   │   ├── User.java                   ← stub (shared table)
│   │   ├── Course.java                 ← stub (shared table)
│   │   └── EnrolledCourse.java         ← stub (shared table)
│   ├── Repositories/
│   │   ├── NotificationRepository.java
│   │   ├── MessageRepository.java
│   │   ├── UserRepository.java
│   │   └── CourseRepository.java
│   └── Dto/
│       ├── Notification/User/
│       │   ├── NotificationRequest.java
│       │   └── NotificationResponse.java
│       ├── Notification/Course/
│       │   └── NotificationCourseRequest.java
│       └── Message/
│           ├── MessageRequest.java
│           └── MessageResponse.java
├── Kafka/
│   └── KafkaConsumer.java              ← listens to 5 topics
├── Config/
│   ├── WebSocketConfig/WebSocketConfig.java
│   └── SwaggerConfig/SwaggerConfig.java
├── Security/
│   ├── Jwt/JwtService.java
│   ├── Jwt/JwtAuthFilter.java
│   ├── WebSocket/WebSocketAuthInterceptor.java
│   └── config/SecurityConfig.java
└── ExcHandler/
    ├── Entites/ResourceNotFoundException.java
    └── GolbalHandler/GolbalHandler.java
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
