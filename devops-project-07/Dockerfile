# syntax=docker/dockerfile:1

FROM python:3.12-slim AS builder

ENV PIP_NO_CACHE_DIR=1 PIP_DISABLE_PIP_VERSION_CHECK=1
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN python -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

FROM python:3.12-slim AS runtime

LABEL org.opencontainers.image.title="devops-project-07" \
      org.opencontainers.image.description="Tetris multijugador (Flask + Socket.IO)"

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH" \
    DB_FILENAME=/app/data/tetris.db

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 1001 tetris \
    && useradd --system --uid 1001 --gid tetris --home /app tetris

WORKDIR /app
COPY --from=builder /opt/venv /opt/venv
COPY --chown=tetris:tetris . .
RUN mkdir -p /app/data && chown -R tetris:tetris /app/data

USER tetris
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -fsS http://127.0.0.1:8080/healthz || exit 1

# Socket.IO necesita un worker asíncrono; con un solo worker no hace falta broker externo.
CMD ["gunicorn", "application:app", \
     "--worker-class", "geventwebsocket.gunicorn.workers.GeventWebSocketWorker", \
     "--workers", "1", \
     "--bind", "0.0.0.0:8080", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]
