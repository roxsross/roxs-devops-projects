# syntax=docker/dockerfile:1

FROM python:3.12-slim AS builder

ENV PIP_NO_CACHE_DIR=1 PIP_DISABLE_PIP_VERSION_CHECK=1
WORKDIR /app

COPY requirements.txt ./
RUN python -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

FROM python:3.12-slim AS runtime

LABEL org.opencontainers.image.title="devops-project-09" \
      org.opencontainers.image.description="Servicio web Flask con JWT, SQLite y cache Redis" \
      org.opencontainers.image.source="https://github.com/roxsross/roxs-devops-projects"

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH" \
    DATABASE_URL=sqlite:////app/data/devops.db \
    LOG_TO_FILE=false \
    PORT=8080

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 1001 appuser \
    && useradd --system --uid 1001 --gid appuser --home /app appuser

WORKDIR /app
COPY --from=builder /opt/venv /opt/venv
COPY --chown=appuser:appuser . .
RUN mkdir -p /app/data /app/logs && chown -R appuser:appuser /app/data /app/logs

USER appuser
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -fsS http://127.0.0.1:8080/health || exit 1

CMD ["gunicorn", "wsgi:app", \
     "--workers", "2", \
     "--threads", "4", \
     "--bind", "0.0.0.0:8080", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]
