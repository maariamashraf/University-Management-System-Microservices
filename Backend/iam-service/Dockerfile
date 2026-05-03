# ─────────────────────────────────────────────────────────────
# Stage 1: Build
# Uses Maven bundled inside the NetBeans JDK to compile & package
# ─────────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom first — lets Docker cache the dependency layer
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copy source and build (skip tests — tests need a running DB)
COPY src ./src
RUN mvn clean package -DskipTests -q

# ─────────────────────────────────────────────────────────────
# Stage 2: Runtime
# Slim JRE image — no build tools in the final image
# ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

RUN apk add --no-cache curl

WORKDIR /app

# Copy only the fat JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the service port
EXPOSE 8081

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
