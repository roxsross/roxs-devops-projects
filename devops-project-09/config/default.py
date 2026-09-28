# *** VARIABLES DE CONFIGURACIÓN ***
# Todos los valores se leen del entorno para no versionar secretos.

import os

# Host y puerto de escucha
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8080"))

# Clave de firma de los JWT. En producción es obligatorio definir SECRET_KEY.
SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-insecure-secret-change-me")

# Base de datos
SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///data/devops.db")
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Cache Redis
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))

# Directorio de logs
LOG_DIR = os.getenv("LOG_DIR", os.path.join(os.getcwd(), "logs"))
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
# Escribir logs en fichero además de stdout (desactivado en contenedores).
LOG_TO_FILE = os.getenv("LOG_TO_FILE", "false").lower() in ("1", "true", "yes")

# Vigencia del token JWT en minutos
TOKEN_EXPIRATION_MINUTES = int(os.getenv("TOKEN_EXPIRATION_MINUTES", "60"))
