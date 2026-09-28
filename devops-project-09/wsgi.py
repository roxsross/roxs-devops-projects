"""Punto de entrada WSGI para gunicorn: `gunicorn wsgi:app`."""

from server import create_app

app = create_app()
