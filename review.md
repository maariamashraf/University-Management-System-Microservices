
# UniSystem — Project Review Report
## Summary

| Section | Total Checks | ✅ Done | ⚠️ Partial | ❌ Missing |
|---|---|---|---|---|
| Docker & Infrastructure | 16 | 16 | 0 | 0 |
| Kafka | 23 | 11 | 5 | 7 |
| Flyway | 15 | 0 | 1 | 14 |
| AOP | 9 | 0 | 0 | 9 |
| Hexagonal Architecture | 9 | 8 | 1 | 0 |
| General Requirements | 7 | 4 | 2 | 1 |
| **TOTAL** | **79** | **39** | **9** | **31** |

Overall Status: 🔴 INCOMPLETE

---

## Section 1 — Docker & Infrastructure
| Check | Status | Notes |
|---|---|---|
| docker-compose.yml exists at the project root | ✅ | |
| docker-compose.yml defines a shared MySQL service named shared-db | ✅ | |
| docker-compose.yml defines Zookeeper service | ✅ | |
| docker-compose.yml defines Kafka service | ✅ | |
| docker-compose.yml defines kafka-init service | ✅ | |
| docker-compose.yml defines kafka-ui service | ✅ | |
| docker-compose.yml defines Redis service | ✅ | |
| docker-compose.yml defines eureka-server service | ✅ | |
| docker-compose.yml defines api-gateway service | ✅ | |
| docker-compose.yml defines iam-service | ✅ | |
| docker-compose.yml defines academic-core service | ✅ | |
| docker-compose.yml defines communication-service | ✅ | |
| All services use healthcheck conditions | ✅ | |
| All services share the same Docker network | ✅ | |
| Volumes defined for: shared-db, kafka, zookeeper, redis | ✅ | |
| Each service has its own Dockerfile using multi-stage build | ✅ | |

## Section 2 — Kafka
| Check | Status | Notes |
|---|---|---|
| KafkaTopics.java exists in infrastructure/adapters/out/kafka/kafkaConfig/ | ⚠️ | Typo in directory name: `kafkaConifg`. |
| KafkaTopics.java declares NewTopic @Bean for ALL 5 topics | ❌ | Topics are declared in `KafkaConfig.java`, but only 3 are defined (student.enrolled, grade.submitted, course.created). |
| Each topic configured with partitions=1, replication-factor=1 | ❌ | Topic builder missing explicit configuration for partitions and replication factor. |
| Uses TopicBuilder to create topics | ✅ | |
| KafkaProducerConfig.java exists | ⚠️ | Typo in directory name: `kafkaConifg`. |
| KafkaProducerConfig.java declares ProducerFactory<String, Object> bean | ✅ | |
| KafkaProducerConfig.java declares KafkaTemplate<String, Object> bean | ✅ | |
| Bootstrap servers read from ${spring.kafka.bootstrap-servers} | ✅ | |
| Key serializer: StringSerializer | ✅ | |
| Value serializer: JsonSerializer | ⚠️ | Imported `com.fasterxml.jackson.databind.JsonSerializer` instead of the Spring Kafka `JsonSerializer`. |
| JsonSerializer has TRUSTED_PACKAGES set to * | ❌ | Missing from config. |
| KafkaEventPublisher.java exists | ⚠️ | Named `KafkaEventPublisherAdapter` in the `kafaAdaptors` package. |
| KafkaEventPublisher.java implements EventPublisherPort | ✅ | |
| KafkaEventPublisher.java is annotated with @Component | ⚠️ | Annotated with `@Service`. |
| KafkaEventPublisher.java uses @Slf4j and logs every published event | ✅ | |
| KafkaEventPublisher.java implements publishStudentEnrolled | ✅ | |
| KafkaEventPublisher.java implements publishAnnouncementCreated | ✅ | |
| KafkaEventPublisher.java implements publishCourseCreated | ✅ | |
| Each publish method uses primary entity ID as the Kafka message key | ❌ | No message keys are provided when publishing. |
| Each publish method sets occurredAt to LocalDateTime.now() | ❌ | `occurredAt` metadata is not set within the publisher. |
| Event DTOs exist | ✅ | |
| Event DTOs use Lombok @Data, @AllArgsConstructor, @NoArgsConstructor | ❌ | Implemented using Java `record` syntax instead of Lombok classes. |
| application.yml has spring.kafka.bootstrap-servers fallback config | ❌ | Hardcoded to `localhost:9092`. |

## Section 3 — Flyway
| Check | Status | Notes |
|---|---|---|
| V1__create_academic_core_tables.sql exists | ❌ | Directory `db/migration` does not exist in academic-core. |
| Tables created in correct dependency order | ❌ | |
| Every table uses CREATE TABLE IF NOT EXISTS | ❌ | |
| department table constraints | ❌ | |
| teacher_department table constraints | ❌ | |
| courses table constraints | ❌ | |
| course_prerequisites table constraints | ❌ | |
| enrolled_courses table constraints | ❌ | |
| announcements table constraints | ❌ | |
| feedback table constraints | ❌ | |
| audit_logs table constraints | ❌ | |
| No cross-service FOREIGN KEY constraints anywhere in the file | ❌ | |
| MySQL 8.0 compatible syntax throughout | ❌ | |
| application.yml has flyway config | ❌ | Missing from `application.yml`. |
| spring.jpa.hibernate.ddl-auto is set to validate | ⚠️ | Set to `validate` in `application.yml` but overridden to `update` in `docker-compose.yml`. |

## Section 4 — AOP
| Check | Status | Notes |
|---|---|---|
| spring-boot-starter-aop dependency exists in pom.xml | ❌ | Missing from `pom.xml`. |
| spring.aop.proxy-target-class: true set in application.yml | ❌ | |
| TeachersOnly.java exists | ❌ | |
| CourseTeacherOnly.java exists | ❌ | |
| AuditLog.java exists | ❌ | |
| TeachersOnlyAspect.java exists | ❌ | |
| CourseTeacherOnlyAspect.java exists | ❌ | |
| AuditLogAspect.java exists | ❌ | |
| Usage in controllers | ❌ | |

## Section 5 — Hexagonal Architecture
| Check | Status | Notes |
|---|---|---|
| Domain layer has NO Spring annotations | ⚠️ | Uses Spring `@Caching` and `@CacheEvict` annotations in the Domain Layer (e.g. `CreateCourseService`). |
| Domain layer has NO JPA annotations | ✅ | |
| Domain layer has NO Kafka imports | ✅ | |
| Port interfaces exist in domain/application/port/out/ | ✅ | |
| Port interfaces exist in domain/application/port/in/ | ✅ | |
| KafkaEventPublisher implements EventPublisherPort | ✅ | |
| Persistence adapters implement port interfaces | ✅ | |
| Controllers call use case interfaces | ✅ | |
| No direct calls from infrastructure layer into domain model constructors that bypass port interfaces | ✅ | |

## Section 6 — General Requirements
| Check | Status | Notes |
|---|---|---|
| All services register with Eureka | ⚠️ | `eureka.instance.prefer-ip-address` missing in `application.yml` (though present in `docker-compose.yml`). |
| All services have Spring Boot Actuator enabled | ❌ | `management.endpoints.web.exposure.include` is missing from `application.yml`. |
| All services have unique spring.application.name values | ✅ | |
| Redis caching configured in academic-core | ⚠️ | Caching setup is mostly done but `spring.cache.type: redis` is missing in `application.yml`. |
| At least 2 meaningful Kafka events flow between services | ✅ | `student-enrolled` and `announcement-created` are correctly consumed. |
| JWT secret externalized via environment variable | ✅ | |
| No hardcoded passwords or secrets in any Java file | ✅ | (Passwords are isolated in property/yml files). |

---

## ❌ Missing Items — Action Required
- **Kafka Topics & Config**: Add `announcement-created`, `notification-push`, and `user-registered` beans in `KafkaConfig.java`. Configure partitions and replication factors via `TopicBuilder`. Add `.TRUSTED_PACKAGES` to the Kafka producer config. Pass keys when calling `kafkaTemplate.send(...)` in the publisher and set `occurredAt` properties in events. Replace Java `record`s with Lombok classes for Event DTOs (if strict adherence to checklist is required). Set `spring.kafka.bootstrap-servers` with a local dev fallback in `application.yml`.
- **Flyway Migrations**: Create `src/main/resources/db/migration/V1__create_academic_core_tables.sql` in `academic-core-Service`. Define the 8 specific schemas avoiding cross-service constraints, using MySQL 8.0 syntax. Add the `spring.flyway.*` properties to `application.yml`.
- **AOP Setup**: Add `spring-boot-starter-aop` to `pom.xml`. Set `spring.aop.proxy-target-class: true`. Implement annotations (`TeachersOnly.java`, `CourseTeacherOnly.java`, `AuditLog.java`) in `infrastructure/aop/annotations/`. Implement aspects (`TeachersOnlyAspect.java`, `CourseTeacherOnlyAspect.java`, `AuditLogAspect.java`) in `infrastructure/aop/aspects/` and annotate controllers.
- **Actuator Config**: Include actuator endpoints configuration in `application.yml` files (`management.endpoints.web.exposure.include: health, info`).

## ⚠️ Partial Items — Needs Fix
- **Path Typos**: Rename `kafkaConifg` to `kafkaConfig` and `kafaAdaptors` to `kafkaAdapters`. Rename `KafkaEventPublisherAdapter` to `KafkaEventPublisher` and annotate with `@Component` instead of `@Service`.
- **Spring Annotations Leak**: Move `@Caching` and `@CacheEvict` out of the domain layer (e.g. from `CreateCourseService`) into the infrastructure/adapter layer to ensure a clean Hexagonal Architecture.
- **Kafka Serialization**: Change `com.fasterxml.jackson.databind.JsonSerializer` to `org.springframework.kafka.support.serializer.JsonSerializer` inside `KafkaProducerConfig.java`.
- **Configuration Overrides**: `spring.jpa.hibernate.ddl-auto` is set to `validate` in `application.yml` but `docker-compose.yml` forces it back to `update` via environment variables. This needs to be synced. Also, `spring.cache.type: redis` needs to be explicitly defined in `application.yml`. 

## 🔍 Notes & Recommendations
- **Record vs. Lombok**: Using Java `record` types instead of Lombok `@Data` classes for Kafka Event DTOs is actually a modern and safer practice. Consider updating the checklist to accept Java `record`s.
- **Database Password**: While passwords are not hardcoded in Java classes, they are checked directly into `application.yml` and `docker-compose.yml` (`01125867988`). It is highly recommended to read these via `${MYSQL_PASSWORD}` or `.env` files rather than hardcoding them into source control.

---
*Review generated on: 2026-05-02*
*Reviewed by: Antigravity Code Reviewer*
