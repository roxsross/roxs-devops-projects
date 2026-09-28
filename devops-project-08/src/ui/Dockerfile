# syntax=docker/dockerfile:1

FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /workspace

COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN ./mvnw -B -q dependency:go-offline

COPY src src
RUN ./mvnw -B -q -DskipTests package \
    && cp target/ui-0.0.1-SNAPSHOT.jar /app.jar

FROM eclipse-temurin:17-jre-alpine AS runtime

LABEL org.opencontainers.image.title="retail-store-ui" \
      org.opencontainers.image.description="Frontend Spring Boot del retail store" \
      org.opencontainers.image.source="https://github.com/roxsross/roxs-devops-projects"

ARG AWS_OTEL_AGENT_VERSION=1.32.5

ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0" \
    JAVA_TOOL_OPTIONS=-javaagent:/opt/aws-opentelemetry-agent.jar \
    OTEL_JAVAAGENT_ENABLED=false

RUN apk add --no-cache curl tini \
    && addgroup -S -g 1000 appuser \
    && adduser -S -u 1000 -G appuser -h /app appuser \
    && curl -fsSL "https://github.com/aws-observability/aws-otel-java-instrumentation/releases/download/v${AWS_OTEL_AGENT_VERSION}/aws-opentelemetry-agent.jar" \
       -o /opt/aws-opentelemetry-agent.jar \
    && chmod 0444 /opt/aws-opentelemetry-agent.jar

WORKDIR /app
COPY --from=build --chown=appuser:appuser /app.jar ./app.jar

USER appuser
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -fsS http://127.0.0.1:8080/actuator/health || exit 1

ENTRYPOINT ["/sbin/tini", "--", "sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
