# University Management System Microservices

This repository currently contains infrastructure orchestration (`docker-compose.yml`) and a partial implementation of the `academic-core` service focused on Kafka event publishing.

## What is included

- `docker-compose.yml` with definitions for:
  - Infrastructure: Zookeeper, Kafka, Kafka UI, Redis, MySQL
  - Platform/services (referenced as build contexts): Eureka Server, API Gateway, IAM, Academic Core, Communication Service, Frontend
- `academic-core` source files for Kafka producer integration:
  - Event publisher adapter (`KafkaEventPublisher`)
  - Event payload models (`StudentEnrolledEvent`, `AnnouncementCreatedEvent`, `CourseCreatedEvent`)
  - Kafka producer config and topic bean config

## Current state

- The repository snapshot is partial: service directories referenced in `docker-compose.yml` (for example `eureka-server`, `api-gateway`, `iam-service`, `communication-service`, `frontend`) are not present here yet.
- Build files for `academic-core` (`pom.xml` or `build.gradle`) are also not present in this snapshot.
