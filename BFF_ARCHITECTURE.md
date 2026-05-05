# API Gateway / BFF Pattern - Implementation Architecture

## Sequence Diagram: Student Details Request

```
Frontend                  API Gateway              IAM Service
   │                           │                        │
   │ GET /api/gateway/         │                        │
   │ dashboard/student/123     │                        │
   │ Authorization: Bearer JWT │                        │
   ├──────────────────────────>│                        │
   │                           │                        │
   │                           │ Validate JWT           │
   │                           │ Check Permissions      │
   │                           │                        │
   │                           │ GET /api/students/     │
   │                           │ details/123            │
   │                           │ Authorization: Bearer  │
   │                           ├───────────────────────>│
   │                           │                        │
   │                           │                        │ Fetch Student from DB
   │                           │                        │ Apply Security Rules
   │                           │                        │
   │                           │<─ StudentProfileResponse
   │                           │ { id, name, email,     │
   │                           │   enrollments, ... }   │
   │                           │                        │
   │<─ 200 OK                  │                        │
   │ StudentProfileResponse    │                        │
   │ { id, name, email, ...}   │                        │
   │                           │                        │
```

## Sequence Diagram: Teacher Details Request

```
Frontend                  API Gateway              IAM Service
   │                           │                        │
   │ GET /api/gateway/         │                        │
   │ dashboard/teacher/456     │                        │
   │ Authorization: Bearer JWT │                        │
   ├──────────────────────────>│                        │
   │                           │                        │
   │                           │ Validate JWT           │
   │                           │ Check Permissions      │
   │                           │                        │
   │                           │ GET /api/teachers/     │
   │                           │ details/456            │
   │                           │ Authorization: Bearer  │
   │                           ├───────────────────────>│
   │                           │                        │
   │                           │                        │ Fetch Teacher from DB
   │                           │                        │ Apply Security Rules
   │                           │                        │
   │                           │<─ TeacherProfileResponse
   │                           │ { id, name, email,     │
   │                           │   department, ... }    │
   │                           │                        │
   │<─ 200 OK                  │                        │
   │ TeacherProfileResponse    │                        │
   │ { id, name, email, ...}   │                        │
   │                           │                        │
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Frontend Application                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │ React Components │  │  Custom Hooks    │  │  Service Layer (BFF)     │  │
│  │                  │  │  (useEffect,     │  │  ├─ studentService.ts   │  │
│  │  Dashboard       │  │   useContext)    │  │  ├─ teacherService.ts   │  │
│  │  UserProfile     │  │                  │  │  ├─ userService.ts      │  │
│  │  CourseList      │  │                  │  │  └─ config.ts           │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▼
                          ┌──────────────────┐
                          │  HTTP Requests   │
                          │  (axios client)  │
                          └──────────────────┘
                                    ▼
                    ┌────────────────────────────────┐
                    │  API Gateway (Port 8080)      │
                    │  ┌──────────────────────────┐ │
                    │  │  DashboardController      │ │
                    │  │  (BFF Endpoints)          │ │
                    │  │                           │ │
                    │  │  GET /api/gateway/        │ │
                    │  │  └─ dashboard/            │ │
                    │  │     ├─ student/{id}      │ │
                    │  │     ├─ teacher/{id}      │ │
                    │  │     └─ user               │ │
                    │  │                           │ │
                    │  │  (Uses WebClient to       │ │
                    │  │   forward to services)    │ │
                    │  └──────────────────────────┘ │
                    │                                │
                    │  ┌──────────────────────────┐ │
                    │  │  Existing Filters:        │ │
                    │  │  - JwtAuthFilter         │ │
                    │  │  - RateLimiterConfig     │ │
                    │  │  - SecurityConfig        │ │
                    │  │  - CorsConfig            │ │
                    │  └──────────────────────────┘ │
                    └────────────────────────────────┘
                            ▼       ▼       ▼
              ┌─────────────────┬──────────┬─────────┐
              │                 │          │         │
              ▼                 ▼          ▼         ▼
         ┌─────────────┐  ┌─────────┐  ┌──────┐
         │   IAM       │  │ Academic │  │ Comm  │
         │  Service    │  │  Core    │  │Service│
         │ Port 8081   │  │ Port 8082│  │8083   │
         │             │  │          │  │       │
         │  /api/      │  │ /api/    │  │/api/  │
         │  students/**│  │courses/**│  │msgs/** │
         │  /api/      │  │/api/     │  │/api/  │
         │  teachers/**│  │enroll/** │  │notif/*│
         └─────────────┘  └─────────┘  └──────┘
```

## Data Flow - Complete Request Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. FRONTEND INITIALIZATION                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  useEffect(() => {                                                           │
│    const userId = getCurrentUserId();  // Extract from JWT                  │
│    getStudentInfo(userId)  // Calls studentService.getStudentInfo()         │
│  }, []);                                                                     │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. STUDENT SERVICE CALL                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  export async function getStudentInfo(id: number): Promise<Student> {       │
│    try {                                                                      │
│      const response = await axios.get<Student>(                             │
│        `${ApiUrl}/api/gateway/dashboard/student/${id}`,  // ← BFF ENDPOINT  │
│        { headers: getAuthHeaders() }                                        │
│      );                                                                      │
│      return response.data;                                                   │
│    } catch (error) { /* handle error */ }                                    │
│  }                                                                            │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. AXIOS HTTP REQUEST                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Method: GET                                                                 │
│  URL: http://localhost:8080/api/gateway/dashboard/student/123               │
│  Headers:                                                                     │
│    ├─ Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...         │
│    ├─ Content-Type: application/json                                        │
│    └─ (CORS preflight if cross-origin)                                      │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. API GATEWAY - INITIAL PROCESSING                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  DashboardController.getStudentDetails() method invoked:                     │
│    1. Receives: studentId=123, Authentication, Authorization header         │
│    2. Logging: "BFF: Fetching student details for student ID: 123"          │
│    3. Extract JWT token from Authorization header                           │
│    4. Validate token format and presence                                     │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. API GATEWAY - FORWARD TO BACKEND SERVICE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  webClientBuilder.build()                                                    │
│    .get()                                                                     │
│    .uri("http://iam-service:8081/api/students/details/{id}", studentId)    │
│    .header(AUTHORIZATION, token)         // ← Forward JWT token            │
│    .header(CONTENT_TYPE, "application/json")                               │
│    .retrieve()                                                               │
│    .toEntity(Object.class)                                                   │
│    .doOnSuccess(...)  // Log success                                         │
│    .doOnError(...)    // Log error                                           │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 6. SERVICE DISCOVERY - EUREKA LOOKUP                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Service Name: iam-service                                                   │
│  Port: 8081                                                                  │
│  Eureka Server: http://eureka-server:8761/eureka                            │
│                                                                               │
│  Lookup Result:                                                              │
│    ✓ iam-service instance found                                             │
│    ✓ IP: 172.20.0.5 (in Docker network)                                    │
│    ✓ Ready for request                                                       │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 7. IAM SERVICE - REQUEST RECEIVED                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  StudentController.getStudentDetails(@PathVariable Long id) {                │
│    1. Receive: id=123, Authorization header with JWT                        │
│    2. Security check: @PreAuthorize("hasRole('ADMIN') or #id == auth...")   │
│    3. Parse JWT token to extract userId                                     │
│    4. Verify user has permission to access student 123                      │
│  }                                                                            │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 8. IAM SERVICE - FETCH STUDENT DATA                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  StudentService.getStudentDetails(id: Long) {                               │
│    1. Query database: SELECT * FROM students WHERE id = 123                 │
│    2. Fetch related data:                                                    │
│       ├─ User information                                                    │
│       ├─ Enrollment data                                                     │
│       ├─ Grade data (if applicable)                                         │
│       └─ Department info                                                     │
│    3. Build StudentProfileResponse DTO                                       │
│    4. Return response                                                        │
│  }                                                                            │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 9. IAM SERVICE - RETURN RESPONSE                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  HTTP/1.1 200 OK                                                             │
│  Content-Type: application/json                                              │
│                                                                               │
│  {                                                                            │
│    "id": 123,                                                                │
│    "firstName": "John",                                                      │
│    "lastName": "Doe",                                                        │
│    "email": "john.doe@university.edu",                                      │
│    "phoneNumber": "+1-555-0123",                                             │
│    "dateOfBirth": "2002-05-15",                                             │
│    "address": "123 Main St, City, State",                                    │
│    "enrolledCourses": [                                                      │
│      { "courseId": 1, "courseName": "CS101", "credits": 3 },               │
│      { "courseId": 2, "courseName": "MATH201", "credits": 4 }              │
│    ],                                                                        │
│    "gpa": 3.8                                                                │
│  }                                                                            │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 10. API GATEWAY - RECEIVE RESPONSE                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  doOnSuccess { response ->                                                   │
│    logging.info("BFF: Successfully fetched student details")                 │
│    // Response is wrapped as ResponseEntity<Object>                         │
│    return response  // ← Pass to Mono stream                                │
│  }                                                                            │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 11. API GATEWAY - RETURN TO FRONTEND                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  HTTP/1.1 200 OK                                                             │
│  Content-Type: application/json                                              │
│  Access-Control-Allow-Origin: http://localhost:3000 (CORS)                  │
│                                                                               │
│  {                                                                            │
│    "id": 123,                                                                │
│    "firstName": "John",                                                      │
│    "lastName": "Doe",                                                        │
│    "email": "john.doe@university.edu",                                      │
│    ...                                                                        │
│  }                                                                            │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 12. FRONTEND - RECEIVE & PROCESS RESPONSE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  axios.get().then(response => {                                              │
│    const studentData = response.data;  // Extract student object            │
│    console.log("Student info fetched via BFF endpoint");                    │
│    return studentData;  // Return to caller                                 │
│  })                                                                           │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 13. REACT COMPONENT - UPDATE STATE                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  getStudentInfo(userId).then(data => {                                       │
│    setStudentData(data);  // Update React state                             │
│    setLoading(false);                                                        │
│  })                                                                            │
│                                                                               │
│  Re-render component with:                                                   │
│    - Student name: "John Doe"                                               │
│    - Email: "john.doe@university.edu"                                      │
│    - Enrolled courses: ["CS101", "MATH201"]                                 │
│    - GPA: 3.8                                                                │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ERROR SCENARIOS                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

SCENARIO 1: Invalid JWT Token
  Frontend → Gateway: Missing/Expired token
           ↓
  Gateway: Validates token in JwtAuthFilter
           ↓
  Response: 401 Unauthorized

SCENARIO 2: User Not Authorized
  Frontend → Gateway: Valid token, but student ID != authenticated user ID
           ↓
  Gateway → IAM Service: Forward request
           ↓
  IAM Service: @PreAuthorize check fails
           ↓
  Response: 403 Forbidden

SCENARIO 3: Student Not Found
  Gateway → IAM Service: GET /api/students/details/999
           ↓
  IAM Service: Student with ID 999 not in database
           ↓
  Response: 404 Not Found

SCENARIO 4: Service Unavailable
  Gateway → IAM Service: Connection timeout
           ↓
  Gateway logs: "BFF: Error fetching student details: Connection refused"
           ↓
  Response: 503 Service Unavailable
```

## Network Communication Diagram

```
LOCAL DEVELOPMENT:
┌──────────────────┐
│  Frontend        │
│ :3000            │
└────────┬─────────┘
         │ localhost:8080
         ▼
    ┌──────────────┐
    │ API Gateway  │
    │ :8080        │
    └───────┬──────┘
            │ localhost:8081
            ▼
        ┌──────────┐
        │ IAM      │
        │ Service  │
        │ :8081    │
        └──────────┘

DOCKER DEPLOYMENT:
┌──────────────────┐
│  Frontend        │
│ my-app           │
│ Port: 80/443     │
└────────┬─────────┘
         │ api-gateway:8080
         ▼
    ┌──────────────┐
    │ API Gateway  │
    │ api-gateway  │
    │ Port: 8080   │
    └───────┬──────┘
            │ http://iam-service:8081
            ▼
        ┌──────────┐
        │ IAM      │
        │ Service  │
        │ iam-     │
        │ service  │
        │ :8081    │
        └──────────┘
```

---

**Generated:** May 5, 2026
**Architecture:** Microservices with API Gateway BFF Pattern
