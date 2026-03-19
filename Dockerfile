# syntax=docker/dockerfile:1.6
# Render-ready Dockerfile for Spring Boot (Maven, Java 21)

FROM --platform=linux/amd64 maven:3-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy build files first for better cache reuse
COPY pom.xml .
# Pre-fetch dependencies to leverage layer caching
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests dependency:go-offline

# Copy source and build the fat jar
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests clean package

# --- Runtime image ---
FROM --platform=linux/amd64 eclipse-temurin:21-jre-jammy AS runtime
ENV PORT=10000
ENV JAVA_OPTS=""
WORKDIR /app

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy only the built jar
COPY --from=builder /app/target/*.jar /app/app.jar

USER appuser
EXPOSE 8080

# Render sets $PORT; default to 10000 when not provided
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -Dserver.port=${PORT:-10000} -jar /app/app.jar"]
