# syntax=docker/dockerfile:1

# ---------- Etapa 1: dependencias ----------
FROM python:3.12-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

COPY requirements.txt ./
RUN python -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

# ---------- Etapa 2: runtime ----------
FROM python:3.12-slim AS runtime

LABEL org.opencontainers.image.title="devops-project-02" \
      org.opencontainers.image.description="Django Hello World servido con Gunicorn" \
      org.opencontainers.image.licenses="MIT"

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH" \
    DJANGO_SETTINGS_MODULE=hello_world_django_app.settings

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 1001 django \
    && useradd --system --uid 1001 --gid django --home /app django

WORKDIR /app

COPY --from=builder /opt/venv /opt/venv
COPY --chown=django:django . .

RUN DJANGO_SECRET_KEY=build-only python manage.py collectstatic --noinput \
    && mkdir -p /app/data \
    && chown -R django:django /app

USER django

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -fsS http://127.0.0.1:8000/healthz || exit 1

CMD ["gunicorn", "hello_world_django_app.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "3", \
     "--threads", "2", \
     "--timeout", "60", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]
