# University Management System - Project Documentation

## Project Overview
The University Management System is a robust, scalable, and modular platform designed to manage university operations, including student enrollment, course management, teacher assignments, and inter-service communication. Built using a **Microservices Architecture**, the system ensures high availability, independent deployability, and fault tolerance.

## Architectural Explanation
The project follows a modern microservices architecture where each service is responsible for a specific domain. Communication between services is handled through REST APIs (synchronous) and Apache Kafka (asynchronous events).

![High Level Architecture Design](https://raw.githubusercontent.com/maariamashraf/University-Management-System-Microservices/main/Diagrams/High%20Level%20Architecture%20Design.jpg)

### Core Components
- **API Gateway**: The single entry point for all client requests, handling routing and cross-cutting concerns.
- **Eureka Server**: Service discovery registry that allows microservices to find and communicate with each other.
- **IAM Service**: Manages identity, authentication (JWT), and user profiles (Students, Teachers, Admins).
- **Academic Core Service**: Handles the core educational domain, including courses, enrollments, and academic records.
- **Communication Service**: Manages notifications, announcements, and messaging between users.

---

## Design Patterns Implemented

### 1. Hexagonal Architecture (Ports and Adapters)
Primarily used in the **Academic Core Service**, this pattern decouples the core business logic from external concerns like databases and web frameworks.
- **Domain**: Business entities and logic.
- **Ports**: Interfaces defining how the domain interacts with the outside world.
- **Adapters**: Implementations of ports (e.g., REST controllers, JPA repositories).

### 2. Facade Pattern
Implemented in the **IAM Service** (e.g., `StudentDashboardFacade`) to provide a simplified interface to a complex set of classes or sub-systems, aggregating data for specific views.

### 3. Strategy Pattern
Used for academic standing calculations (`AcademicStandingStrategy`) in the **IAM Service**, allowing for different algorithms to be used interchangeably based on the student's status or university policy.

### 4. Observer Pattern (Event-Driven)
Facilitated by **Apache Kafka**. Services publish events (e.g., `UserCreated`, `CourseEnrolled`) that other services subscribe to, ensuring eventual consistency across the system.

### 5. Aspect-Oriented Programming (AOP)
Used for cross-cutting concerns like logging, performance monitoring, and security across various services without cluttering the business logic.

### 6. Backend for Frontend (BFF)
The **API Gateway** acts as a BFF in some scenarios, aggregating data from multiple microservices to provide a tailored response for the frontend application.

---

## API Endpoints List

### IAM Service
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate and get JWT |
| GET | `/api/users/me` | Get current user profile |
| GET | `/api/students/details/{id}` | Get detailed student profile |
| GET | `/api/teachers/details/{id}` | Get detailed teacher profile |
| PUT | `/api/users/{id}` | Update user information |

### Academic Core Service 
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/courses` | Create a new course |
| GET | `/api/courses` | List all available courses |
| POST | `/api/enrollments` | Enroll a student in a course |
| GET | `/api/announcements/course/{courseId}` | Get announcements for a course |
| POST | `/api/feedbacks` | Submit feedback for a course |
| GET | `/api/semesters` | List academic semesters |

### Communication Service 
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/notifications/user/{userId}` | Get notifications for a user |
| POST | `/api/messages` | Send a direct message |
| GET | `/api/messages/course/{courseId}` | Get course group messages |

### API Gateway / Dashboard
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/gateway/dashboard/student/{id}` | Get aggregated student dashboard data |
| GET | `/api/gateway/dashboard/teacher/{id}` | Get aggregated teacher dashboard data |

---

## Diagrams Reference
All project diagrams are located in the [`Diagrams directory`](https://github.com/maariamashraf/University-Management-System-Microservices/tree/main/Diagrams):

- **ERD**
- **Sequence Diagrams**
- **Use Case Diagrams**
- **Activity Diagrams**
- **Class Diagram (+OCL)**
- **SRS Document**

---

## How to Run the Project

The entire system, including infrastructure and microservices, is orchestrated using **Docker Compose**.

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) installed and running.
- [Docker Compose](https://docs.docker.com/compose/install/) (included in Docker Desktop).

### Running the System
1. **Clone the repository**:
   ```bash
   git clone https://github.com/maariamashraf/University-Management-System-Microservices
   cd University-Management-System-Microservices
   ```
2. **Build and start the services**:
   ```bash
   docker-compose up --build
   ```
   *This will download images, build the microservices, and start the entire cluster.*

3. **Verify the services**:
   Once all containers are healthy, you can access the following dashboards:
   - **Eureka Dashboard** (Service Registry): [http://localhost:8761](http://localhost:8761)
   - **Kafka UI** (Message Monitor): [http://localhost:8090](http://localhost:8090)

### Accessing the Application
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **API Gateway**: [http://localhost:8080](http://localhost:8080)

### Infrastructure Details
- **Shared Database**: MySQL running on `localhost:3307` (mapped from 3306).
- **Message Broker**: Kafka on `localhost:9092`.
- **Cache**: Redis on `localhost:6379`.
