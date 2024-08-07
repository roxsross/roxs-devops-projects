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

Esta es una versión dockerizada de la aplicación original publicada por la comunidad de Spring Boot.

**Ejecutar la aplicación PetClinic localmente**

Petclinic es una aplicación Spring Boot construida usando Maven. Es una aplicación diseñada para mostrar cómo se puede usar el stack de Spring para construir aplicaciones simples pero poderosas orientadas a bases de datos. La versión oficial de PetClinic demuestra el uso de Spring Boot con Spring MVC y Spring Data JPA.

![](https://user-images.githubusercontent.com/313480/179161406-54a28200-d52e-411f-bfbe-463cf64b64b3.png)

**¿Cómo funciona?**

Spring Boot trabaja con MVC (Modelo-Vista-Controlador), un patrón en el diseño de software comúnmente utilizado para implementar interfaces de usuario, datos y lógica de control. Enfatiza una separación entre la lógica de negocio y su visualización. Esta "separación de preocupaciones" proporciona una mejor división del trabajo y una mejora en el mantenimiento. Podemos trabajar con la capa de persistencia o acceso a datos con spring-data de una manera simple y muy rápida, sin necesidad de crear tantas clases manualmente. Spring Data viene con métodos incorporados a continuación o por defecto que permiten guardar, eliminar, actualizar y/o crear.

**Primeros pasos**

```
git clone https://github.com/roxsross/roxs-devops-projects.git
cd roxs-devops-projects/devops-project-04
./mvnw package
java -jar target/*.jar
```

Luego, puedes acceder a petclinic aquí: [http://localhost:8080/](http://localhost:8080/)

*Imagen*

La aplicación permite realizar las siguientes funciones:

- Añadir Mascotas
- Añadir Propietarios
- Buscar Propietarios
- Buscar Veterinarios
- Manejo de excepciones

O puedes ejecutarla directamente desde Maven usando el plugin de Spring Boot Maven. Si haces esto, recogerá los cambios que realices en el proyecto de inmediato (los cambios en los archivos fuente de Java también requieren una compilación - la mayoría de las personas usan un IDE para esto):

```
./mvnw spring-boot:run
```


NOTA: Si prefieres usar Gradle, puedes construir la aplicación usando `./gradlew build` y buscar el archivo jar en `build/libs`.

**Construyendo un Contenedor**

```
docker build -t petclinic-app . -f Dockerfile
```

**Construcción Multi-Stage**

```
docker build -t petclinic-app . -f Dockerfile.multi
```

**Usando Docker Compose**

```
docker-compose up -d
```

**Referencias**

Construcción de la aplicación PetClinic usando [Dockerfile](https://github.com/dockersamples/spring-petclinic-docker/blob/main/readme.md#:~:text=Building%20PetClinic%20app%20using%20Dockerfile)

# ¡Dale una Estrella! ⭐

***Si estás planeando usar este repositorio para aprender, por favor dale una estrella. ¡Gracias!***


> Recuerda documentar los pasos y decisiones tomadas durante la configuraciónde este proyecto ¡Buena suerte!