# Backend bug report

This file lists **concrete issues** found by reviewing the current `Backend/` code and configuration. Severity is **functional impact**, not style.

**Last reviewed:** against the current repo state (IAM, Academic Core, API Gateway, Communication).

---

## Resolved (kept for history)

These were previously reported and are **addressed in code now**:

| Topic | What changed |
|--------|----------------|
| Academic public paths | `SecurityConfig` uses **`/api/courses/popular`**, **`/api/departments/all`**, **`/api/feedbacks/recent`** (leading `/` is correct). |
| Academic auth context | `AuthFiltter` reads **`X-User-Id`** / **`X-Roles`** and sets `SecurityContext` (works when the API Gateway forwards those headers). |
| IAM username not found | `UserServiceImpl#getUserByUsername` throws **`UserNotFoundByUsernameException`** → **`404`** via existing `UserNotFoundException` handling. |
| IAM `SecurityConfig` | **`UserDetailsServiceImpl`** is no longer injected there (unused wiring removed). |
| `UserRepository` | Unused **`Query`** / **`Param`** imports removed; **`findAllByRole`** retained. |
| JWT `userId` claim (login/register) | **`JwtUtils.generateToken`** adds **`userId`** when the principal is **`CustomUserDetails`** (normal login/register path). |
| IAM refresh | **`POST /api/auth/refresh`** removed — obtain a new JWT via **`/api/auth/login`** or **`/api/auth/register`** only. |

---

## Critical / High

### 1. Academic Core: traffic without gateway headers

**File:** `Backend/academic-core-Service/.../AuthFiltter.java`

Authentication is set only when **`X-User-Id`** and **`X-Roles`** are present. Calls to Academic Core **without** those headers (direct `localhost:8082`, Postman to the service) still see an anonymous user → **`401`** on `.anyRequest().authenticated()`.

**Effect:** By design if everything goes through the gateway; **breaks** local/integration tests that hit the service directly without injecting headers.

---

## High

### 2. IAM: `jwt.secret=${JWT_SECRET}` — failure if unset

**File:** `Backend/iam-service/src/main/resources/application.properties`

If **`JWT_SECRET`** is missing or empty, signing/validation can fail at runtime.

**Mitigation:** Always set `JWT_SECRET` in env or `.env`; use a long random value.

---

### 3. IAM: `findAllByRole` on JOINED `User` hierarchy

**File:** `Backend/iam-service/.../UserRepository.java`

Derived query on superclass with **JOINED** inheritance can produce odd SQL or duplicates in edge Hibernate versions.

**Effect:** Low until you see wrong lists; verify with tests for `getUsersByRole`.

---

## Medium

### 4. `AuthFiltter` implementation details

**File:** `Backend/academic-core-Service/.../AuthFiltter.java` (also note the **typo** in the class name.)

- Instantiated with **`new AuthFiltter()`** in `SecurityConfig` — not a Spring `@Bean` (OK for stateless filter; cannot inject dependencies later without refactor).
- Unused import: **`SecurityFilterChain`**.
- Authority is built as **`new SimpleGrantedAuthority(role)`** — must match the **exact** string the gateway sends (e.g. **`ROLE_STUDENT`**). Any format mismatch breaks `@PreAuthorize`.

---

## Low / environment

### 5. API Gateway vs IAM Eureka defaults

**File:** `Backend/api-gateway/src/main/resources/application.properties`

`eureka.client.service-url.defaultZone=http://eureka-server:8761/eureka` vs IAM defaulting to **`localhost`** for Eureka.

**Effect:** Local dev outside Docker may fail service discovery unless hostnames align.

---

### 6. Root `.env`

A **`.env`** may exist at the repo root for Compose or tooling; Spring Boot services still read **`application.properties` / `.yml`** unless you wire a dotenv loader. Ensure required variables (**`JWT_SECRET`**, **`MYSQL_PASSWORD`**, etc.) are set wherever you actually run apps.

---

## Intentionally not listed as bugs

- **Admin bootstrap** via `CommandLineRunner` (your planned approach).
- **Communication service** allowing **`/api/**`** by design (`permitAll`), WebSocket secured separately.

---

## Suggested verification (when Maven/JDK available)

```bash
cd Backend/iam-service && mvn -q -DskipTests compile
cd ../academic-core-Service && mvn -q -DskipTests compile
cd ../api-gateway && mvn -q -DskipTests compile
cd ../communication-service && mvn -q -DskipTests compile
```

Smoke tests: **`POST /api/auth/login`** (IAM); **`GET /api/courses/popular`** via gateway (with and without JWT as intended); direct hit to Academic Core with **`X-User-Id`** / **`X-Roles`** headers mimicking the gateway.
