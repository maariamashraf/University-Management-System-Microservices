# API Gateway / BFF (Backend for Frontend) Pattern Implementation

## Overview

This document describes the implementation of the **API Gateway / BFF (Backend for Frontend) Pattern** in the University Management System Microservices architecture. This pattern centralizes frontend API access through a single gateway endpoint, enabling better control, aggregation, and transformation of data.

---

## Architecture Before BFF Pattern

```
┌─────────────────┐
│    Frontend     │
└────────┬────────┘
         │ Direct calls
         │
    ┌────┴────┬──────────┐
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│Student │ │Teacher │ │ Auth   │
│Service │ │Service │ │Service │
└────────┘ └────────┘ └────────┘
```

**Problems with this approach:**

- Frontend needs to know about all backend services
- Multiple API endpoints to manage
- No single point for cross-cutting concerns (logging, rate limiting, aggregation)
- Frontend must handle authentication for each service call
- Difficult to evolve backend without breaking frontend

---

## Architecture After BFF Pattern

```
┌─────────────────┐
│    Frontend     │
└────────┬────────┘
         │ Single endpoint
         │
    ┌────▼──────────────────────────┐
    │   API Gateway (Port 8080)      │
    │  /api/gateway/dashboard/*      │
    │  (BFF Controller)              │
    └────┬───────┬──────────┬────────┘
         │       │          │
    ┌────▼──┐ ┌──▼────┐ ┌──▼────┐
    │Student│ │Teacher│ │ User   │
    │Service│ │Service│ │Service │
    └───────┘ └───────┘ └────────┘
```

**Benefits of BFF pattern:**

- ✅ Single, stable frontend endpoint
- ✅ Server-side data aggregation and transformation
- ✅ Centralized authentication and authorization
- ✅ Improved security through gateway-managed requests
- ✅ Better logging and monitoring
- ✅ Ability to cache and optimize responses
- ✅ Backend services can evolve independently

---

## Implementation Details

### 1. API Gateway Controller (DashboardController.java)

**Location:** `Backend/api-gateway/src/main/java/com/unisystem/api_gateway/controller/DashboardController.java`

The `DashboardController` is the new BFF controller that handles all frontend requests for dashboard data:

```java
@RestController
@RequestMapping("/api/gateway/dashboard")
public class DashboardController {

    // Get Student Details via BFF
    @GetMapping("/student/{id}")
    public Mono<ResponseEntity<?>> getStudentDetails(
        @PathVariable("id") Long studentId,
        Authentication authentication,
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String token)

    // Get Teacher Details via BFF
    @GetMapping("/teacher/{id}")
    public Mono<ResponseEntity<?>> getTeacherDetails(
        @PathVariable("id") Long teacherId,
        Authentication authentication,
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String token)

    // Get Aggregated User Dashboard
    @GetMapping("/user")
    public Mono<ResponseEntity<?>> getUserDashboard(
        Authentication authentication,
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String token)
}
```

**Key Features:**

- Uses Spring Cloud's `WebClient` for reactive, non-blocking communication with backend services
- Handles JWT token propagation to downstream services
- Provides logging for debugging and monitoring
- Supports authentication from API Gateway context

### 2. Frontend Service Layer Updates

#### studentService.ts

**Before:**

```typescript
const response = await axios.get<Student>(
  `${ApiUrl}/api/students/details/${_id}`,
  {
    headers: getAuthHeaders(),
  },
);
```

**After:**

```typescript
// Now calls BFF endpoint through API Gateway
const response = await axios.get<Student>(
  `${ApiUrl}/api/gateway/dashboard/student/${_id}`,
  {
    headers: getAuthHeaders(),
  },
);
```

#### teacherService.ts

**Before:**

```typescript
const response = await axios.get<Teacher>(
  `${ApiUrl}/api/teachers/details/${_id}`,
  {
    headers: getAuthHeaders(),
  },
);
```

**After:**

```typescript
// Now calls BFF endpoint through API Gateway
const response = await axios.get<Teacher>(
  `${ApiUrl}/api/gateway/dashboard/teacher/${_id}`,
  {
    headers: getAuthHeaders(),
  },
);
```

### 3. API Gateway Configuration

**File:** `Backend/api-gateway/src/main/resources/application.properties`

```properties
# BFF (Backend for Frontend) - Dashboard Routes
# These endpoints are handled locally by the API Gateway's DashboardController
# They aggregate data from multiple services for optimized frontend consumption
```

The BFF endpoints are handled directly by the DashboardController (not through Spring Cloud Gateway routes), making them available at:

- `GET /api/gateway/dashboard/student/{id}` - Get student details
- `GET /api/gateway/dashboard/teacher/{id}` - Get teacher details
- `GET /api/gateway/dashboard/user` - Get aggregated user dashboard data

---

## Request Flow Diagram

### Student Details Request Flow

```
1. Frontend Request
   └─► GET /api/gateway/dashboard/student/123
       Header: Authorization: Bearer {JWT_TOKEN}

2. API Gateway (DashboardController)
   └─► Validates request
   └─► Extracts JWT token
   └─► Logs request

3. Gateway → IAM Service
   └─► GET http://iam-service:8081/api/students/details/123
       Header: Authorization: Bearer {JWT_TOKEN}

4. IAM Service Response
   └─► Returns StudentProfileResponse with details

5. API Gateway → Frontend
   └─► Returns response to frontend
   └─► Logs response

6. Frontend Processing
   └─► Updates UI with student details
```

---

## Configuration Flow

```
Frontend Config (config.ts)
├─ ApiUrl: http://localhost:8080
├─ getAuthHeaders() returns:
│  └─ Authorization: Bearer {JWT_TOKEN}
│  └─ Content-Type: application/json
└─ Used by all service calls

Service Layer (studentService.ts, teacherService.ts)
├─ Calls `${ApiUrl}/api/gateway/dashboard/student/{id}`
├─ Calls `${ApiUrl}/api/gateway/dashboard/teacher/{id}`
└─ Passes Authorization header

API Gateway (DashboardController)
├─ Receives request with JWT token
├─ Forwards to appropriate backend service
├─ Returns response to frontend
└─ All services communicate via service discovery (Eureka)
```

---

## Service URLs

### Frontend → API Gateway (Public Endpoints)

| Endpoint                              | Method | Purpose                   |
| ------------------------------------- | ------ | ------------------------- |
| `/api/gateway/dashboard/student/{id}` | GET    | Fetch student details     |
| `/api/gateway/dashboard/teacher/{id}` | GET    | Fetch teacher details     |
| `/api/gateway/dashboard/user`         | GET    | Fetch user dashboard data |

### API Gateway → Backend Services (Internal Endpoints)

| Service     | URL                                                 | Purpose               |
| ----------- | --------------------------------------------------- | --------------------- |
| IAM Service | `http://iam-service:8081/api/students/details/{id}` | Get student details   |
| IAM Service | `http://iam-service:8081/api/teachers/details/{id}` | Get teacher details   |
| IAM Service | `http://iam-service:8081/api/users/me`              | Get current user info |

---

## Development & Deployment

### Local Development

1. **API Gateway** runs on `http://localhost:8080`
2. **IAM Service** runs on `http://localhost:8081`
3. **Frontend** calls `http://localhost:8080/api/gateway/dashboard/*`

### Docker Deployment

1. **API Gateway** container ports `8080`
2. **Services** communicate via service names (Eureka service discovery)
3. **Frontend** calls `http://api-gateway:8080/api/gateway/dashboard/*`

### Environment Variables

```env
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:8080

# Backend (application.properties)
eureka.client.service-url.defaultZone=http://eureka-server:8761/eureka
jwt.secret=<your-secret-key>
```

---

## Future Enhancements

### 1. **Data Aggregation**

Enhance the BFF controller to aggregate multiple service calls into a single response:

```typescript
// Example: Aggregate student details with course enrollments
@GetMapping("/student/{id}/dashboard")
public Mono<ResponseEntity<?>> getStudentDashboard(@PathVariable Long studentId) {
    // 1. Get student details from Student Service
    // 2. Get enrolled courses from Academic Core
    // 3. Get recent messages from Communication Service
    // 4. Aggregate and return combined response
}
```

### 2. **Response Transformation**

Transform backend responses to match frontend-specific DTO models:

```java
// Transform service response to frontend-optimized DTO
private StudentDashboardDTO transformToFrontendDTO(StudentResponse response) {
    // Map fields according to frontend expectations
    // Exclude sensitive data if needed
    // Format dates and numbers for frontend
}
```

### 3. **Caching**

Implement response caching to reduce backend load:

```java
@Cacheable(value = "studentDetails", key = "#studentId")
public Mono<ResponseEntity<?>> getStudentDetails(@PathVariable Long studentId) {
    // Response will be cached based on studentId
}
```

### 4. **Request/Response Logging**

Add detailed logging for monitoring and debugging:

```java
@Around("@annotation(com.unisystem.api_gateway.annotations.LogBFFCall)")
public Object logBFFCall(ProceedingJoinPoint joinPoint) {
    // Log incoming request
    // Log outgoing response
    // Log timing and errors
}
```

### 5. **Rate Limiting per Endpoint**

Apply rate limiting specifically to BFF endpoints:

```properties
spring.cloud.gateway.routes[5].id=bff-dashboard
spring.cloud.gateway.routes[5].predicates[0]=Path=/api/gateway/dashboard/**
spring.cloud.gateway.routes[5].filters[0].name=RequestRateLimiter
```

---

## Migration Checklist

- [x] Create `DashboardController` in API Gateway
- [x] Implement `/api/gateway/dashboard/student/{id}` endpoint
- [x] Implement `/api/gateway/dashboard/teacher/{id}` endpoint
- [x] Implement `/api/gateway/dashboard/user` endpoint
- [x] Update `studentService.ts` to use BFF endpoint
- [x] Update `teacherService.ts` to use BFF endpoint
- [x] Add documentation comments to services
- [x] Update API Gateway configuration
- [ ] Test endpoints locally
- [ ] Test with Docker Compose
- [ ] Deploy to production
- [ ] Monitor gateway performance
- [ ] Implement caching (future enhancement)
- [ ] Implement response aggregation (future enhancement)

---

## Testing the Implementation

### 1. Test Student Details Endpoint

```bash
curl -X GET http://localhost:8080/api/gateway/dashboard/student/1 \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json"
```

### 2. Test Teacher Details Endpoint

```bash
curl -X GET http://localhost:8080/api/gateway/dashboard/teacher/1 \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json"
```

### 3. Test User Dashboard Endpoint

```bash
curl -X GET http://localhost:8080/api/gateway/dashboard/user \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json"
```

---

## Troubleshooting

### Issue: 404 Not Found on `/api/gateway/dashboard/*`

**Solution:** Ensure the `DashboardController` is in the correct package and Spring Boot is scanning it:

- Check package: `com.unisystem.api_gateway.controller`
- Verify `@SpringBootApplication` scans the controller package
- Check logs for bean registration

### Issue: 401 Unauthorized

**Solution:** Verify JWT token is being passed correctly:

- Check `Authorization` header format: `Bearer {JWT_TOKEN}`
- Verify token is not expired
- Check JWT secret configuration matches across services

### Issue: 502 Bad Gateway

**Solution:** Verify backend services are running and accessible:

- Check if IAM Service is running on port 8081
- Verify Eureka service discovery has the service registered
- Check container networking for Docker deployment

### Issue: CORS Errors

**Solution:** Verify CORS configuration in API Gateway:

- Check `CorsConfig.java` for allowed origins
- Verify frontend URL is in allowed origins list
- Check if credentials are being sent correctly

---

## References

- [Spring Cloud Gateway Documentation](https://spring.io/projects/spring-cloud-gateway)
- [Backend for Frontend Pattern](https://martinfowler.com/bliki/BFF.html)
- [API Gateway Pattern](https://microservices.io/patterns/apigateway.html)
- [Service Mesh Patterns](https://microservices.io/patterns/service-mesh.html)

---

## Version History

| Version | Date     | Changes                            |
| ------- | -------- | ---------------------------------- |
| 1.0     | May 2026 | Initial BFF pattern implementation |
|         |          | - Created DashboardController      |
|         |          | - Updated frontend services        |
|         |          | - Added documentation              |

---

**Last Updated:** May 5, 2026
**Author:** Architecture Team
**Status:** Implemented ✅
