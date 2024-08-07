'''
Servicio Web que escucha en el puerto 8080
@autor: Rossana RoxsRoss
295devops
IV Bootcamp DevOps

'''

# ***IMPORTS*** #
# Empleamos la biblioteca FLASK para implementar el servicio web
from flask import Flask
# Para la base de datos y la cache
from flask_sqlalchemy import SQLAlchemy


import redis

# Para hacer uso de argumentos
import argparse

# Para hacer uso de los logs
import logging
from logging.handlers import TimedRotatingFileHandler

# Imports de sistema y fecha
import os
import time

# Parámetros por defecto y configuración
import config.default

# Current working dir
cwd = os.getcwd()

# Manejador de la Base de Datos
db = SQLAlchemy()


# REDIS Cache
cache = redis.Redis(host='redis', port=6379)

# *** METODOS *** #
# Función para crear la app Flask
def create_app():
    # La aplicación a partir de la clase Flask
    app = Flask(__name__)
    # Configuraciones
    # SECRET_KEY generada mediante secrets.token_hex()
    app.config['SECRET_KEY'] = config.default.SECRET_KEY
    app.config['SQLALCHEMY_DATABASE_URI'] = config.default.SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = config.default.SQLALCHEMY_TRACK_MODIFICATIONS
    # Activamos el logging
    configure_logging(app)
    # Iniciamos la base de datos
    db.init_app(app)
    # Registro de los Blueprints
    from endpoints.public import public_bp
    app.register_blueprint(public_bp)
    from endpoints.private import private_bp
    app.register_blueprint(private_bp)

    return app


# Comprobación de argumentos
def main():
    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument("-p", '--port', type=int, help="numero de puerto de escucha", required=False, default=config.default.PORT)
    args = parser.parse_args()

    print("Escuchando en puerto: ", args.port)
    return args.port


# Funciones para el logging
def configure_logging(app):
    # Eliminamos los posibles manejadores, si existen, del logger por defecto
    del app.logger.handlers[:]
    # Añadimos el logger por defecto a la lista de loggers
    loggers = [app.logger, ]
    ## Añadimos el logger por defecto a la lista de loggers y el de sqlalchemy
    # loggers = [app.logger, logging.getLogger('sqlalchemy'), ]
    handlers = []
    # Creamos un manejador para escribir los mensajes por consola
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)
    console_handler.setFormatter(verbose_formatter())
    handlers.append(console_handler)

    # Creamos un manejador para el fichero de trazas de la app
    app_log_handler = logging.handlers.TimedRotatingFileHandler(filename=cwd + '/logs/server',
                                                                when='midnight',
                                                                interval=1,
                                                                backupCount=14)
    app_log_handler.suffix = "%Y%m%d.log"
    app_log_handler.setLevel(logging.INFO)
    app_log_handler.setFormatter(verbose_formatter())
    handlers.append(app_log_handler)

    #Creamos el manejador para el fichero de errores
    app_err_log_handler = logging.handlers.TimedRotatingFileHandler(filename=cwd + '/logs/error',
                                                                    when='midnight',
                                                                    interval=1,
                                                                    backupCount=14)
    app_err_log_handler.suffix = "%Y%m%d.log"
    app_err_log_handler.setLevel(logging.ERROR)
    app_err_log_handler.setFormatter(verbose_formatter())
    handlers.append(app_err_log_handler)

    # Asociamos cada uno de los handlers a cada uno de los loggers
    for l in loggers:
        for handler in handlers:
            l.addHandler(handler)
        l.propagate = False
        l.setLevel(logging.DEBUG)


def verbose_formatter():
    return logging.Formatter(
        '[%(asctime)s.%(msecs)d]\t %(levelname)s \t[%(name)s.%(funcName)s:%(lineno)d]\t %(message)s',
        datefmt='%d/%m/%Y %H:%M:%S'
    )


def get_hit_count():
    retries = 5
    while True:
        try:
            return cache.incr('hits')
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)


# Para que se inicie la aplicación al ejecutar el script
# (Esto se excluye del test porque
# check_file() tiene su propio test
# main() tiene también su propio test
# y app.run() depende de Flask)
if __name__ == "__main__": #pragma: no cover
    port = main()
    app = create_app()
    app.run(host=config.default.HOST, port=port)

