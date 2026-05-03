# University Management System Microservices

This repository contains the backend microservices and infrastructure orchestration for the University Management System.

## Project Structure

The project currently includes the following microservices located in the `Backend/` directory:
- **`api-gateway`**: Spring Cloud Gateway for routing requests.
- **`eureka-server`**: Service Registry for microservice discovery.
- **`iam-service`**: Authentication, users, and role-based endpoints.
- **`academic-core-Service`**: Courses, departments, enrollments, announcements, feedback, Kafka producers.
- **`communication-service`**: Notifications, messages, WebSocket, Kafka consumers (Compose profile **`full`**).

## Infrastructure

The `docker-compose.yml` file provides orchestration for the following:
- **Zookeeper & Kafka**: For event-driven communication (e.g., `user-registered`, `student-enrolled`, `course-created`).
- **Kafka UI**: For monitoring Kafka topics and clusters.
- **Redis**: Caching layer.
- **MySQL**: Shared database for the microservices.

## Current State

- The initial microservices have been scaffolded and moved into the `Backend/` directory.
- `academic-core-Service` is implemented with full build files (`pom.xml`) and includes Kafka producer integration (e.g., `KafkaConfig`, `KafkaTopics`) along with event payload models.
- **Note**: The `docker-compose.yml` build contexts currently point to the root directories (e.g., `./eureka-server`). If you are building the images via Docker Compose, make sure to update the context paths to point to the `Backend/` directory (e.g., `./Backend/eureka-server`).

---

## Technical & architecture review

*Snapshot review based on backend configs, gateway routes, Kafka usage, security settings, database layout, and frontend API usage. Severity reflects engineering risk—not only coursework tolerance.*

### Assumptions

- Intended path: browser → **API Gateway (8080)** → Eureka-backed services (**IAM**, **academic-core**, **communication-service**).
- Production deployment specifics (routing in front of Compose, SSO, CDN) were **not** verified from this repo alone.

---

### 1. Architecture & design

#### Critical

| Issue | Problem | Fix |
|--------|---------|-----|
| **API Gateway routing gaps / path mismatch** | Gateway routes **academic-core** to `/api/courses/**`, `/api/departments/**`, `/api/enrolled-courses/**`. Academic exposes **`/api/enrollments`**, **`/api/announcements`**, **`/api/feedbacks`**, etc. Gateway routes **`/api/students/**`** and **`/api/teachers/**`** to IAM, but IAM uses **`/api/users/...`** (e.g. `/api/users/students`). Many requests **404** or hit the wrong service. | Publish a single path contract (OpenAPI or table). Update gateway **predicates** (and rewrites if needed). Align **frontend** URLs with real controllers. |
| **Kafka topic names: producers vs consumers--DONE✅** | Academic publishes to **`student.enrolled`**, **`course.created`**, **`announcement.created`**. Communication consumer listens to **`student-enrolled`**, **`course-created`**, **`announcement-created`**. Compose **kafka-init** creates hyphen names; academic **NewTopic** beans create dot names. Events **do not flow** reliably between services. | Standardize **one naming scheme** everywhere (producers, consumers, `kafka-init`, remove duplicate creation if one source is canonical). |

#### High

| Issue | Problem | Fix |
|--------|---------|-----|
| **Shared MySQL / schema** | One **`shared-db`** / **`helwanuni`** for multiple services = **shared-database anti-pattern** (coupling, unclear ownership). | Prefer **DB per service** or separate schemas + no cross-service tables; use APIs/events across boundaries. For coursework, document as intentional **modular monolith split**. |
| **Event payload mismatch** | e.g. `StudentEnrollend(studentId, enrolledCourseId)` vs consumer expecting **`courseName`**, etc.; `AnnouncementCreatedEvent` fields vs consumer expecting **title/description/courseName**. | Shared **schema/DTO** (or versioned contract) + **contract tests** (e.g. Pact). |

#### Medium

| Issue | Problem | Fix |
|--------|---------|-----|
| **Inconsistent structure** | Academic-core uses ports/adapters; communication-service uses different packages/naming. | Align packages; optional small **shared contract** module. |
| **`CourseTeacherOnlyAspect` incomplete** | Checks teacher **role** from headers, not **ownership of the course**. | Load course, compare **teacherId** to authenticated user (see Security for trusting headers). |

#### Low

| Issue | Problem | Fix |
|--------|---------|-----|
| **Naming typos--DONE✅** | e.g. `StudentEnrollend`, `kafkaConifg`. | Rename with care if topics/events are public. |

---

### 2. Service communication

#### Critical

- Same as **Kafka topic inconsistency--DONE✅** (section 1).

#### High

| Issue | Problem | Fix |
|--------|---------|-----|
| **No gateway resilience defaults** | No visible **timeouts / retries / circuit breakers** for downstream calls. | Resilience4j (or equivalent) on gateway routes; HTTP client timeouts; idempotent retries only where safe. |
| **Communication-service Eureka** | Default `application.properties` disables Eureka; gateway uses **`lb://COMMUNICATION-SERVICE`**. Must match **enabled discovery** in the environment you run. | Enable Eureka in Compose when using `lb://`, or use direct URLs in a **local** profile. |

#### Medium

| Issue | Problem | Fix |
|--------|---------|-----|
| **WebSocket / SockJS path** | Frontend may use **`/ws`**; gateway config may not route it. | Add explicit route for **`/ws/**`** (and SockJS paths) to communication-service if traffic goes through gateway. |

#### Low

- **kafka-init** sleep/shell is fragile but acceptable for labs.

---

### 3. Data management

#### High

| Issue | Problem | Fix |
|--------|---------|-----|
| **Mixed DDL strategies** | e.g. **`ddl-auto: update`** vs **`validate`** + Flyway across services on shared DB. | One **migration owner** per table; prefer **`validate` + Flyway** for owned schemas. |

#### Medium

| Issue | Problem | Fix |
|--------|---------|-----|
| **Cross-service IDs without FK** | `teacher_id` / `student_id` reference IAM without DB FK. | Document trade-off; add **lifecycle events**/reconciliation jobs if needed. |

---

### 4. Scalability & performance

#### Medium

| Issue | Problem | Fix |
|--------|---------|-----|
| **Redis cache TTL-only** | ~10-minute TTL → **stale reads** after writes. | **`@CacheEvict`** / targeted invalidation on mutations. |
| **Unstructured Kafka publish logging** | `System.out` in adapters. | **SLF4J + MDC** (structured logs). |

#### Low

- Eureka + blocking stacks fine at small scale; tune or migrate if load grows.

---

### 5. Security

#### Critical

| Issue | Problem | Fix |
|--------|---------|-----|
| **Trust boundary on `X-User-*` headers** | Gateway sets headers after JWT; **academic-core** has **no Spring Security** in codebase review; **communication-service** uses **permitAll**. Anything reaching services **directly** can **spoof headers**. | Validate **JWT inside each exposed service** (or **mTLS** internal mesh); do not trust client-supplied identity headers alone. |

#### High

| Issue | Problem | Fix |
|--------|---------|-----|
| **Kafka JSON deserializer trust** | e.g. `trusted.packages=*` with generic `Map` consumption widens deserialization risk. | Allowlisted packages + **typed DTOs** + schema discipline. |
| **Default secrets in Compose / properties** | Default DB password / **JWT_SECRET** fine for demos, unsafe if reachable publicly. | Secrets via env/secrets manager; strong JWT entropy; rotation plan. |

#### Medium

| Issue | Problem | Fix |
|--------|---------|-----|
| **Gateway public routes** | Only `/api/auth/login` and `/api/auth/register` whitelisted without token; OAuth2/other public paths must be listed explicitly if used. | Central list of **public predicates** aligned with IAM. |
| **`X-Roles` string format** | `roles.toString()` from JWT claims can be brittle for `.contains(...)`. | Parse claims into a canonical **role set**. |

---

### 6. Error handling & observability

#### High

| Issue | Problem | Fix |
|--------|---------|-----|
| **No global `@ControllerAdvice` in academic-core** | Raw **`RuntimeException`** paths → inconsistent **500** responses. | Unified error model (e.g. problem+json); map domain errors to **4xx**. |
| **Audit annotation vs persistence** | AOP logs to logs; **`audit_logs` table exists** but admin UI may expect **`/api/audit-logs`** without a matching backend. | Persist audits + expose read API **or** remove misleading UI/feature name. |

#### Medium

| Issue | Problem | Fix |
|--------|---------|-----|
| **No distributed tracing** | Hard cross-service debugging. | OpenTelemetry / Micrometer tracing + header propagation. |

---

### 8. Code quality

#### Medium

- Duplicate / disabled JWT story in communication-service vs gateway.
- Kafka async handling + `System.out` — unify logging and failure reporting.

#### Low

- Service README vs actual **pom** versions (documentation drift).

---

### 9. Testing

#### High

| Issue | Problem | Fix |
|--------|---------|-----|
| **Sparse automated tests** | Gateway routes, Kafka contracts, enrollment APIs, auth — largely **uncovered**. | Testcontainers + contract tests + gateway filter tests + minimal E2E through gateway. |

---

### 10. General issues

- **`/api/enrollments`** (backend) vs **`/api/enrolled-courses`** (frontend/gateway predicate) → likely **broken** unless an unseen proxy maps paths.
- Frontend: **`/api/students/**`**, **`/api/teachers/**`**, **`/api/permissions/**`**, **`/api/events/**`**, **`/api/audit-logs/**`** — some endpoints **may not exist** on backend yet (**verify** controllers vs UI).

---

### Overall quality summary

Useful skeleton: **Gateway + JWT filter**, **Eureka**, **Redis cache**, **Kafka events**, layered **academic-core**. Weak spot: **integration alignment** — routes, REST paths, **Kafka topics + payloads**, and **service-local auth** — need to be unified for stable end-to-end behavior.

---

### Prioritized action plan

1. **Unify HTTP contracts** — Gateway predicates, controllers, frontend (especially enrollments vs enrolled-courses, users vs students/teachers).
2. **Fix Kafka** — ✅One topic naming convention; ❌align **kafka-init**, `NewTopic`, producers, consumers; ❌fix **payload shapes**.
3. **Harden services** — JWT (or equivalent) beyond gateway for every internet-facing hop; eliminate **permitAll** in integrated profiles.
4. **Clarify data ownership** — Shared DB documented or split; consistent Flyway/DDL strategy.
5. **Errors & audits** — Global handlers; real audit persistence/API if admin features require it.
6. **Tests** — Integration + contract tests around gateway and messaging.
