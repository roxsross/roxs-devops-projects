# Entorno de Desarrollo
Se ha escogido emplear Docker para poder ejecutar el entorno de desarrollo de manera rápida y sencilla.

Basta con descargarse el repositorio y tener instalado Docker Engine y Docker Compose (la versión Desktop contiene ambos componentes).

Se han incluido los ficheros Dockerfile y docker-compose.yml que contienen la configuración del contenedor de docker para montar una imagen de python 3.8 y una caché redis.

Para el entorno de Python es necesario también el fichero requirements.txt donde se listan todos paquetes de los que depende nuestra aplicación.

Para desplegar un entorno local en el que trabajar rápidamente, sólo necesitamos ejecutar la instrucción docker-compose up desde el directorio del proyecto para que se creen las imágenes, las monte y se ejecute la aplicación (las subsiguientes ejecuciones solo montaran las imágenes y ejecutaran la aplicación).
Se lanzará el servicio, el cual será accesible desde la dirección:
_https://localhost:8000_

A continuación se muestra el contenido de los ficheros de configuración de  docker:

Soporta python 3.8, 3.9 y 3.10

[Dokerfile](../Dockerfile)
```properties
FROM python:3.8
```

[requirements.txt](../requirements.txt)
```
atomicwrites==1.4.0
attrs==21.4.0
certifi==2021.10.8
cffi==1.15.0
click==8.0.4
colorama==0.4.4
coverage==6.3.2
cryptography==3.4.8
Flask==2.0.3
Flask-SQLAlchemy==2.5.1
greenlet==1.1.1
iniconfig==1.1.1
itsdangerous==2.0.1
Jinja2==3.0.3
MarkupSafe==2.0.1
packaging==21.3
pip==21.1.2
pluggy==1.0.0
py==1.11.0
pycparser==2.21
PyJWT==2.1.0
pyOpenSSL==19.1.0
pyparsing==3.0.4
pytest==6.2.5
redis==3.5.3
setuptools==57.0.0
six==1.16.0
SQLAlchemy==1.4.32
toml==0.10.2
Werkzeug==2.0.3
wheel==0.36.2
wincertstore==0.2
```