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


El enfoque en DevOps está transformando la forma en que construimos, desplegamos y gestionamos aplicaciones. La colaboración entre desarrollo y operaciones es más crucial que nunca, y el dominio de herramientas como Docker, Kubernetes y prácticas avanzadas de CI/CD puede marcar la diferencia en la forma en que llevamos nuestras ideas al mercado.

Esta colección de 10 proyectos está diseñada para llevarte a través de una ola de aprendizaje y práctico a través del ecosistema DevOps. Cada proyecto ha sido cuidadosamente seleccionado para abordar diferentes aspectos y herramientas del mundo DevOps, ofreciendo una experiencia completa que abarca desde los fundamentos básicos hasta conceptos avanzados.

## ¿Cuál es el objetivo?

El objetivo de esta colección es proporcionarte un conjunto de herramientas prácticas y desafiantes que te permitan fortalecer tus habilidades en DevOps. Cada proyecto está diseñado para ser más que un simple ejercicio; son oportunidades para resolver problemas reales, implementar soluciones innovadoras y colaborar con la comunidad.

## ¡Tu viaje comienza ahora!

A medida que exploras estos proyectos, recuerda que cada desafío es una oportunidad para aprender y crecer. La tecnología avanza rápidamente, y estar al tanto de las últimas herramientas y prácticas es fundamental para mantener una ventaja competitiva. Al involucrarte en estos proyectos open source, estás dando un paso significativo hacia la mejora continua y la excelencia en el campo de DevOps.

## Cómo trabajar con los proyectos

Todos los proyectos comparten la misma estructura: `Dockerfile` multi-stage con usuario sin privilegios, `docker-compose.yml` con healthchecks y límites de recursos, manifiestos en `k8s/` y un `.env.example` cuando hay secretos.

```bash
make help          # lista los targets disponibles
make up-05         # levanta el proyecto 05 con docker compose
make logs-05       # sigue sus logs
make down-05       # lo baja y elimina volúmenes
make lint-docker   # hadolint sobre todos los Dockerfile
make scan-09       # escaneo de vulnerabilidades con Trivy
```

Antes de levantar un proyecto que traiga `.env.example`, copialo a `.env` y ajustá los valores:

```bash
cp devops-project-09/.env.example devops-project-09/.env
```

Para desplegar en Kubernetes:

```bash
kubectl apply -f devops-project-10/k8s/
```

### CI/CD

| Workflow | Qué hace |
| --- | --- |
| `.github/workflows/ci.yml` | Tests por stack (Node, Python, Java, Go, .NET) solo en los proyectos que cambiaron, más validación de compose y manifiestos k8s |
| `.github/workflows/docker.yml` | Build, lint, escaneo Trivy, SBOM y publicación en GHCR de cada imagen |
| `.github/workflows/security.yml` | Trivy config/IaC, escaneo de secretos y CodeQL |
| `.github/dependabot.yml` | Actualizaciones semanales de npm, pip, maven, gomod, nuget, docker y actions |

## Proyecto 0: DevOps-Project-00
Este proyecto incluye una aplicación web simple con HTML y CSS. Super Mario Phaser es una recreación del clásico juego Super Mario Bros utilizando el framework Phaser. Este proyecto tiene como objetivo brindar la experiencia nostálgica de jugar el icónico juego de plataformas en navegadores web modernos. 

- **Tecnologías**: HTML, CSS
- **Ubicación**: [devops-project-00](devops-project-00/)

## Proyecto 1: DevOps-Project-01
Este proyecto incluye una aplicación web simple con HTML y CSS. Es ideal para aprender los conceptos básicos de la estructura de un proyecto web.

- **Tecnologías**: HTML, CSS
- **Ubicación**: [devops-project-01](devops-project-01/)

## Proyecto 2: DevOps-Project-02
Este proyecto es una aplicación Django que incluye un Dockerfile para la contenerización y un archivo de requisitos para la gestión de dependencias.

- **Tecnologías**: Django, Docker
- **Ubicación**: [devops-project-02](devops-project-02/)

## Proyecto 3: DevOps-Project-03
Este proyecto se centra en desplegar servicios frontend y backend en un clúster de Kubernetes. Incluye múltiples servicios backend y un frontend, todos construidos con Express.js.

- **Tecnologías**: Docker, Express.js
- **Ubicación**: [devops-project-03](devops-project-03/)

## Proyecto 4: DevOps-Project-04
Este proyecto es una versión dockerizada de la aplicación PetClinic de Spring Boot. Incluye instrucciones para ejecutar la aplicación localmente y construir un contenedor Docker.

- **Tecnologías**: Spring Boot, Docker, Maven
- **Ubicación**: [devops-project-04](devops-project-04/)

## Proyecto 5: DevOps-Project-05
Este proyecto se enfoca en la integración continua y entrega continua (CI/CD) utilizando Jenkins. Incluye pipelines para construir, probar y desplegar aplicaciones automáticamente.

- **Tecnologías**: Node, Net y Python
- **Ubicación**: [devops-project-05](devops-project-05/)

## Proyecto 6: DevOps-Project-06
Este proyecto que permite a los usuarios buscar las condiciones climáticas de cualquier ciudad del mundo y proporciona información meteorológica actual. La aplicación obtiene datos meteorológicos utilizando la API de [SheCodes Weather](https://www.weather.shecodes.io/).

- **Tecnologías**: React
- **Ubicación**: [devops-project-06](devops-project-06/)

## Proyecto 7: DevOps-Project-07
Este proyecto funciona como un servidor Flask con el que los usuarios pueden interactuar a través de su navegador, conociendo la IP de la máquina que lo está sirviendo y el puerto, que por defecto es 8080. Se muestra en el lado del cliente utilizando la biblioteca p5.js.

- **Tecnologías**: Python
- **Ubicación**: [devops-project-07](devops-project-07/)

## Proyecto 8: DevOps-Project-08
Este es un ejemplo de aplicación diseñado para ilustrar varios conceptos relacionados con contenedores. Presenta una aplicación e-commerce que incluye un catálogo de productos, un carrito de compras y un proceso de pago.

- **Tecnologías**: Java, go, Python, Node
- **Ubicación**: [devops-project-08](devops-project-08/)

## Proyecto 9: DevOps-Project-09
Este proyecto se enfoca en un Servicio web de consultas devops.

- **Tecnologías**: python
- **Ubicación**: [devops-project-09](devops-project-09/)

## Proyecto 10: DevOps-Project-10
Este proyecto  simple escrito en Golang. Utiliza el paquete `net/http` para servir solicitudes HTTP.

- **Tecnologías**: go
- **Ubicación**: [devops-project-10](devops-project-10/)



### _"DevOps es el arte de la colaboración y la automatización, donde la innovación y la confiabilidad se unen para crear un camino continuo hacia el éxito."_

🔥🔥🔥🔥

<img width="80%" src="https://roxsross-linktree.s3.amazonaws.com/295-full-website-banner-transparent-white.png"> 


### ✉️  &nbsp;Contactos 

Me puedes encontrar en:

[![site](https://img.shields.io/badge/Hashnode-2962FF?style=for-the-badge&logo=hashnode&logoColor=white&link=https://blog.295devops.com) ](https://blog.295devops.com)
[![Blog](https://img.shields.io/badge/dev.to-0A0A0A?style=for-the-badge&logo=devdotto&logoColor=white&link=https://dev.to/roxsross)](https://dev.to/roxsross)
![Twitter](https://img.shields.io/twitter/follow/roxsross?style=for-the-badge)
[![Linkedin Badge](https://img.shields.io/badge/-LinkedIn-blue?style=for-the-badge&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/roxsross/)](https://www.linkedin.com/in/roxsross/)
[![Instagram Badge](https://img.shields.io/badge/-Instagram-purple?style=for-the-badge&logo=instagram&logoColor=white&link=https://www.instagram.com/roxsross)](https://www.instagram.com/roxsross/)
[![Youtube Badge](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white&link=https://www.youtube.com/channel/UCa-FcaB75ZtqWd1YCWW6INQ)](https://www.youtube.com/channel/UCa-FcaB75ZtqWd1YCWW6INQ)


<samp>
"Para entender algo no debes entenderlo sino serlo"
<samp>