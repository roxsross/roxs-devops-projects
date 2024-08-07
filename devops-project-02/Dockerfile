# Importando la imagen base
FROM python:3.9

# Actualizando el host de Docker o la máquina anfitriona
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Cambiando el directorio de trabajo actual a /usr/src/app
WORKDIR /usr/src/app

# Copiando el archivo requirements.txt al directorio de trabajo actual
COPY requirements.txt ./

# Instalando las dependencias en el contenedor
RUN pip install -r requirements.txt

# Copiando todos los archivos al directorio de trabajo actual
COPY . .

# Informando a Docker que el contenedor escucha en los
# puertos de red especificados en tiempo de ejecución, es decir, 8000.
EXPOSE 8000

# Ejecutando el servidor
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
