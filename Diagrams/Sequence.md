## 1. User Authentication (Login)
This flow handles secure user authentication and JWT generation.

```mermaid
  sequenceDiagram
    title 1. User Registration & Profile Logic

    actor S as User
    participant F as Frontend
    participant G as API Gateway
    participant IAM as IAM Service
    participant DB as Shared Database

    S->>F: Fill Registration Form
    F->>G: POST /api/auth/register (username, email, role, teacherCode?)
    G->>IAM: Forward Request

    IAM->>IAM: Validate Unique Email/Username

    alt Role = Teacher
        IAM->>IAM: Verify teacherCode
        IAM->>DB: Save Teacher Entity
    else Role = Student
        IAM->>DB: Save Student Entity
    end

    IAM->>IAM: Auto-Authenticate & Generate JWT

    IAM-->>G: AuthResponse (JWT)
    G-->>F: Registration Successful
    F-->>S: Redirect to Dashboard
```
## 2. Student Course Enrollment 
This use case demonstrates asynchronous communication using Kafka for notifications.
```mermaid
  sequenceDiagram
      title 2. Student Course Enrollment
      actor S as Student
      participant F as Frontend
      participant G as API Gateway
      participant AC as Academic Core Service
      participant DB as Shared Database
      participant K as Kafka (Topic: student-enrolled)
      participant KC as KafkaConsumer
      participant CS as Communication Service
  
      %% Browse Courses Flow
      S->>F: Browse Courses
      F->>G: GET /api/courses
      G->>AC: Forward Request
      AC->>DB: Retrieve Courses
      DB-->>AC: List<Course>
      AC-->>G: 200 OK (Courses List)
      G-->>F: Return Courses
      F-->>S: Display Available Courses
  
      %% Enrollment Flow
      S->>F: Enroll in Course
      F->>G: POST /api/enrolled-courses (studentId, courseId)
      G->>AC: Forward Request
      AC->>AC: Validate Enrollment Logic
      AC->>DB: Save Enrollment Record
      AC->>K: Publish StudentEnrolled Event
      AC-->>G: 200 OK (Enrollment Info)
      G-->>F: Enrollment Successful
      F-->>S: Show Confirmation
  
      %% Notification Flow
      Note over K,KC: Asynchronous Event Consumption
  
      K->>KC: Consume student-enrolled Event
      KC->>KC: onStudentEnrolled(event)
      KC->>CS: sendNotificationToUser(request)
  
      CS->>DB: Save Notification Record
      CS-->>F: Push Notification (WebSocket)
  
      F->>CS: GET /api/notifications/user/{userId}
      CS-->>F: Return Notifications
      F-->>S: Display Notification
```
## 3. Teacher Posting Announcement (Broadcast Flow)
Demonstrates broadcasting updates to multiple recipients via events.

```mermaid
  sequenceDiagram
      title 3. Teacher Posting Announcement (Broadcast Flow)
  
      actor T as Teacher
      participant F as Frontend
      participant G as API Gateway
      participant AC as Academic Core Service
      participant DB as Shared Database
      participant K as Kafka (Topic: announcement-created)
      participant KC as KafkaConsumer
      participant CS as Communication Service
      actor S as Student
  
      %% Teacher Creates Announcement
      T->>F: Create Announcement
      F->>G: POST /api/announcements/create
      G->>AC: Forward Request
  
      AC->>AC: Validate Teacher Access
      AC->>DB: Save Announcement
      AC->>K: Publish AnnouncementCreated Event
  
      AC-->>G: 201 Created
      G-->>F: Announcement Created
      F-->>T: Show Success Message
  
      %% Notification Broadcast Flow
      Note over K,KC: Asynchronous Broadcast
  
      K->>KC: Consume announcement-created Event
      KC->>CS: sendNotificationToCourse(request)
  
      CS->>AC: GET /api/enrolled-courses/course/{courseId}
      AC-->>CS: List of Enrolled Students
  
      CS->>DB: Bulk Save Notifications
      CS-->>F: Push Notification (WebSocket)
  
      %% Student Views Announcement
      S->>F: Open Announcements Page
      F->>G: GET /api/announcements/student/{studentId}
      G->>AC: Forward Request
      AC->>DB: Retrieve Student Announcements
      DB-->>AC: List<Announcement>
      AC-->>G: Return Announcements
      G-->>F: Announcement List
      F-->>S: Display Announcements & Notifications
```
