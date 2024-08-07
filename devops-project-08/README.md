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

# Containers Retail Sample

Este es un ejemplo de aplicación diseñado para ilustrar varios conceptos relacionados con contenedores. Presenta una aplicación e-commerce que incluye un catálogo de productos, un carrito de compras y un proceso de pago.

Ofrece:

- Una arquitectura de componentes distribuidos en varios lenguajes y frameworks.
- Utilización de diversos backends de persistencia para diferentes componentes, como MySQL, DynamoDB y Redis.
- La capacidad de ejecutarse en varias tecnologías de orquestación de contenedores como Docker Compose, Kubernetes, etc.
- Imágenes preconstruidas de contenedores para arquitecturas de CPU x86-64 y ARM64.
- Todos los componentes instrumentados para métricas de Prometheus y trazado OpenTelemetry OTLP.
- Soporte para Istio en Kubernetes.
- Generador de carga que ejercita toda la infraestructura.

Este proyecto está destinado únicamente con fines educativos y no para uso en producción.

![Screenshot](/docs/images/screenshot.png)

# Arquitectura de la Aplicación

La aplicación ha sido deliberadamente sobreingenierizada para generar múltiples componentes desacoplados. Estos componentes generalmente tienen diferentes dependencias de infraestructura y pueden admitir varios "backends" (por ejemplo: el servicio de Carritos admite MongoDB o DynamoDB).

```
.
├── README.md
├── docker-compose.yml
├── docs
│   └── images
└── src
    ├── assets
    ├── cart
    ├── catalog
    ├── checkout
    ├── orders
    └── ui
```


![Screenshot](/docs/images/arq.png)

# Docker Compose

Este método de implementación se ejecutará en la máquina local/server utilizando docker-compose y construirá los contenedores como parte de la implementación.

**Requisitos previos:**
- Docker instalado localmente

1. Docker Compose:

    ```bash
    docker-compose up -d --build
    ```

2. Abre el frontend en una ventana del navegador:

    [http://localhost:8888](http://localhost:8888)

3. Para detener los contenedores en docker-compose, utiliza Ctrl+C. Para eliminar todos los contenedores y recursos relacionados, ejecuta:

    ```bash
    docker compose down
    ```



# ¡Dale una Estrella! ⭐

***Si estás planeando usar este repositorio para aprender, por favor dale una estrella. ¡Gracias!***


> Recuerda documentar los pasos y decisiones tomadas durante la configuraciónde este proyecto ¡Buena suerte!