# syntax=docker/dockerfile:1

FROM golang:1.23-alpine AS build

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/catalog main.go

FROM alpine:3.21 AS runtime

LABEL org.opencontainers.image.title="retail-store-catalog" \
      org.opencontainers.image.description="Servicio de catálogo (Go + Gin + MariaDB)" \
      org.opencontainers.image.source="https://github.com/roxsross/roxs-devops-projects"

ENV GIN_MODE=release

RUN apk add --no-cache ca-certificates curl tini \
    && addgroup -S -g 1000 appuser \
    && adduser -S -u 1000 -G appuser -h /app appuser

WORKDIR /app
COPY --from=build --chown=appuser:appuser /out/catalog /app/catalog
COPY --chown=appuser:appuser db/ /app/db/

USER appuser
EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=5 \
    CMD curl -fsS http://127.0.0.1:8080/health || exit 1

ENTRYPOINT ["/sbin/tini", "--", "/app/catalog"]
