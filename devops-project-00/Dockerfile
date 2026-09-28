# syntax=docker/dockerfile:1

# Imagen Nginx sin privilegios: corre como UID 101 y escucha en 8080
FROM nginxinc/nginx-unprivileged:1.27-alpine

LABEL org.opencontainers.image.title="devops-project-00" \
      org.opencontainers.image.description="Super Mario Bros en Phaser servido con Nginx" \
      org.opencontainers.image.licenses="MIT"

COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx index.html /usr/share/nginx/html/
COPY --chown=nginx:nginx assets/ /usr/share/nginx/html/assets/
COPY --chown=nginx:nginx javascript/ /usr/share/nginx/html/javascript/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
