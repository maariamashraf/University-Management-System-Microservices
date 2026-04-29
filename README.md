# University Management System Microservices

This repository contains the backend microservices and infrastructure orchestration for the University Management System.

## Project Structure

The project currently includes the following microservices located in the `Backend/` directory:
- **`api-gateway`**: Spring Cloud Gateway for routing requests.
- **`eureka-server`**: Service Registry for microservice discovery.
- **`academic-core-Service`**: Core academic operations handling event publishing via Kafka.

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
