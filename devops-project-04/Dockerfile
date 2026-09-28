# syntax=docker/dockerfile:1
# Imagen de desarrollo (hot reload). Para producción usar Dockerfile.multi.

FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw -B dependency:go-offline

COPY src ./src

RUN groupadd --system --gid 1001 spring \
    && useradd --system --uid 1001 --gid spring --home /app spring \
    && chown -R spring:spring /app

USER spring
EXPOSE 8080

CMD ["./mvnw", "spring-boot:run"]
