"""Configuración común de la suite: base de datos aislada y usuario de pruebas.

Las variables de entorno deben fijarse antes de importar `config.default`,
que es quien las lee en tiempo de import.
"""

import os
import tempfile

_DB_DIR = tempfile.mkdtemp(prefix="devops09-tests-")

os.environ["SECRET_KEY"] = "test-only-secret"
os.environ["DATABASE_URL"] = "sqlite:///" + os.path.join(_DB_DIR, "test.db")
os.environ["LOG_TO_FILE"] = "false"

import pytest  # noqa: E402
from werkzeug.security import generate_password_hash  # noqa: E402

from server import create_app, db  # noqa: E402
from models.entitys import User  # noqa: E402


@pytest.fixture(scope="session", autouse=True)
def seed_test_user():
    app = create_app()
    with app.app_context():
        if User.query.filter_by(name="testUser").first() is None:
            db.session.add(
                User(
                    public_id="00000000-0000-0000-0000-000000000001",
                    name="testUser",
                    password=generate_password_hash("testPass"),
                )
            )
            db.session.commit()
