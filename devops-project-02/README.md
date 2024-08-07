# Bootcamp DevOps by RoxsRoss
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Terraform](https://img.shields.io/badge/terraform-7B42BC?logo=terraform&logoColor=white&style=for-the-badge)
![VSCode](https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
![kubernetes](https://img.shields.io/badge/kubernetes-326CE5?logo=kubernetes&logoColor=white&style=for-the-badge)
![Azure](https://img.shields.io/badge/azure-0078D4?logo=microsoft-azure&logoColor=white&style=for-the-badge)
![Amazon](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Gcp](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Docker](https://img.shields.io/badge/docker-2496ED?logo=docker&logoColor=white&style=for-the-badge)
![python](https://img.shields.io/badge/python-3776AB?logo=python&logoColor=white&style=for-the-badge)
![golang](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![github Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Gitlab](https://img.shields.io/badge/GitLab-330F63?style=for-the-badge&logo=gitlab&logoColor=white)
![Jenkins](	https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=Jenkins&logoColor=white)
![city](https://img.shields.io/badge/TeamCity-000000?style=for-the-badge&logo=TeamCity&logoColor=white)

---
![](https://github.com/roxsross/roxsross/blob/main/images/roxsross-banner-1.png)

🔥🔥🔥🔥

# Desplegar una Aplicación Django 

## Requisitos Previos

* Django
* Conocimientos básicos sobre Docker
* Cuenta en AWS
* La creatividad siempre es un plus 😃

## Framework Web Django

***Django es un framework web de alto nivel en Python que fomenta un desarrollo rápido y un diseño limpio y pragmático. Es gratuito y de código abierto, tiene una comunidad activa y en crecimiento, una excelente documentación y muchas opciones de soporte gratuitas y de pago. Utiliza HTML/CSS/Javascript para el frontend y Python para el backend.***

![](img.png)

## Pasos para Desplegar

### Construir la Imagen Docker

Usa el siguiente comando para construir la imagen Docker con un nombre específico:

```bash
docker build -t django-app:version-1 .
```

### 3. Verificar la Imagen Docker

Asegúrate de que la imagen se ha creado correctamente:

```bash
docker images | grep django-app
```

### 2. Crear Repositorio en Docker Hub

Para almacenar la imagen en Docker Hub:

- Crea una cuenta en [Docker Hub](https://hub.docker.com/).
- Inicia sesión en Docker Hub desde tu terminal:

  ```bash
  docker login
  ```

- Etiqueta tu imagen para Docker Hub:

  ```bash
  docker tag django-app:version-1 yourdockerhubusername/django-app:version-1
  ```

- Sube la imagen a Docker Hub:

  ```bash
  docker push yourdockerhubusername/django-app:version-1
  ```

### 3. Probando el contenedor


  ```bash
  docker run -d -p:8000:8000 yourdockerhubusername/django-app:version-1
  ```

## ¡Felicidades! 🙂


**Hemos desplegado con éxito nuestra aplicación Django.**

### Consideraciones Adicionales

Cuando despliegues una aplicación Django en producción, considera lo siguiente:

* **Seguridad:** Asegúrate de que la aplicación y el entorno estén protegidos.
* **Monitoreo:** Implementa herramientas para monitorizar el rendimiento y los logs.
* **Balanceo de carga:** Usa balanceadores de carga para distribuir el tráfico.
* **Planes de recuperación:** Ten un plan para recuperar la aplicación en caso de fallos.

# ¡Dale una Estrella! ⭐

***Si estás planeando usar este repositorio para aprender, por favor dale una estrella. ¡Gracias!***


> Recuerda documentar los pasos y decisiones tomadas durante la configuraciónde este proyecto ¡Buena suerte!
