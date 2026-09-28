# syntax=docker/dockerfile:1

FROM nginxinc/nginx-unprivileged:1.27-alpine

LABEL org.opencontainers.image.title="devops-project-01" \
      org.opencontainers.image.description="Netflix clone estático servido con Nginx" \
      org.opencontainers.image.licenses="MIT"

COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx index.html style.css /usr/share/nginx/html/
COPY --chown=nginx:nginx assets/ /usr/share/nginx/html/assets/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
