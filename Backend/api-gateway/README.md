# 🛡️ API Gateway & Eureka Server

> Part of the **University Management System** — Microservices Architecture  
> Handles all incoming traffic, JWT authentication, service routing, and service discovery.

---

## 📌 Overview

This module contains two core infrastructure services:

| Service | Role | Port |
|---|---|---|
| **Eureka Server** | Service registry & discovery | `8761` |
| **API Gateway** | Single entry point, JWT filter, routing | `8080` |

### Architecture Position

```
React (Frontend)
       │
       ▼
  API Gateway  ←──── Eureka Server (service discovery)
  (port 8080)              ▲    ▲    ▲
       │               registers themselves
  ┌────┼────────────┐      │    │    │
  ▼    ▼            ▼      │    │    │
[IAM] [Academic] [Comm] ───┘    │    │
                                │    │
                         [API Gateway itself]
```

---

## 🧩 Responsibilities

### Eureka Server
- Acts as the **service registry** (phone book for microservices)
- All services register themselves on startup
- Tracks health via **heartbeats every 30 seconds**
- Removes dead services automatically after 90 seconds
- Exposes a dashboard at `http://localhost:8761`

### API Gateway
- **Single entry point** for all client requests
- Runs **JWT validation filter** before forwarding any request
- Routes requests to correct microservice using `lb://` (load balanced via Eureka)
- Injects user info (userId, role) into headers after JWT validation
- No service is directly accessible from outside

---

## 🗂️ Project Structure

```
api-gateway-eureka/
├── eureka-server/
│   ├── src/main/java/
│   │   └── EurekaServerApplication.java
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
│
└── api-gateway/
    ├── src/main/java/
    │   ├── ApiGatewayApplication.java
    │   └── filter/
    │       └── JwtAuthFilter.java
    ├── src/main/resources/
    │   └── application.yml
    └── pom.xml
```

---

## ⚙️ Configuration

### Eureka Server — `application.yml`

```yaml
server:
  port: 8761

spring:
  application:
    name: eureka-server

eureka:
  client:
    register-with-eureka: false   # Server doesn't register itself
    fetch-registry: false
  server:
    wait-time-in-ms-when-sync-empty: 0
```

### API Gateway — `application.yml`

```yaml
server:
  port: 8080

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      routes:
        - id: iam-service
          uri: lb://IAM-SERVICE
          predicates:
            - Path=/api/auth/**

        - id: academic-service
          uri: lb://ACADEMIC-SERVICE
          predicates:
            - Path=/api/academic/**

        - id: communication-service
          uri: lb://COMMUNICATION-SERVICE
          predicates:
            - Path=/api/communication/**

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

---

## 🔐 JWT Auth Filter Flow

```
Incoming Request
      │
      ▼
Extract token from Header
"Authorization: Bearer <token>"
      │
      ├── No token? ──────────────────────────▶ 401 Unauthorized
      │
      ▼
Validate JWT signature & expiry
      │
      ├── Invalid / Expired? ──────────────────▶ 401 Unauthorized
      │
      ▼
Extract userId + role from token
      │
      ▼
Inject into request headers:
  X-User-Id: 123
  X-User-Role: STUDENT
      │
      ▼
Forward to microservice ✅
```

### Skipped routes (no JWT needed):
```yaml
- /api/auth/register
- /api/auth/login
```

---

## 🚀 How Services Register with Eureka

Every other microservice just needs these two things:

**`pom.xml`**
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

**`application.yml`**
```yaml
spring:
  application:
    name: iam-service  # unique name per service

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

| Service | Registered Name |
|---|---|
| IAM Service | `iam-service` |
| Academic Core | `academic-service` |
| Communication | `communication-service` |
| API Gateway | `api-gateway` |

---

## 🐳 Docker Compose — Startup Order

```yaml
eureka-server:
  build: ./eureka-server
  ports:
    - "8761:8761"

api-gateway:
  build: ./api-gateway
  ports:
    - "8080:8080"
  depends_on:
    - eureka-server
  environment:
    - EUREKA_URL=http://eureka-server:8761/eureka/
```

> ⚠️ **Important:** Eureka must start first, then microservices, then API Gateway.

---

## 🏃 Running Locally

```bash
# 1. Start Eureka Server first
cd eureka-server
mvn spring-boot:run

# 2. Start API Gateway
cd ../api-gateway
mvn spring-boot:run

# 3. Verify Eureka dashboard
open http://localhost:8761
```

---

## 📡 API Routes

| Method | Path | Routed To | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | IAM Service | ❌ |
| `POST` | `/api/auth/login` | IAM Service | ❌ |
| `GET` | `/api/auth/**` | IAM Service | ✅ |
| `GET` | `/api/academic/**` | Academic Core | ✅ |
| `POST` | `/api/academic/**` | Academic Core | ✅ |
| `GET` | `/api/communication/**` | Communication | ✅ |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Spring Boot | Base framework |
| Spring Cloud Gateway | API Gateway & routing |
| Spring Cloud Netflix Eureka | Service discovery |
| JWT (jjwt) | Token validation in filter |
| Docker Compose | Container orchestration |
