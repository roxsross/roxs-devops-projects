# syntax=docker/dockerfile:1

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

LABEL org.opencontainers.image.title="retail-store-assets" \
      org.opencontainers.image.description="Servidor de assets estáticos (Nginx)" \
      org.opencontainers.image.source="https://github.com/roxsross/roxs-devops-projects"

USER root
COPY default.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
COPY public/ /usr/share/nginx/html
RUN chown -R 101:101 /usr/share/nginx/html

USER 101
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/health >/dev/null 2>&1 || exit 1

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
