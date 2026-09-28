# syntax=docker/dockerfile:1

# ---------- Build ----------
FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
# Las variables REACT_APP_* se incrustan en el bundle en tiempo de build.
ARG REACT_APP_WEATHER_API_KEY
ARG REACT_APP_DEFAULT_CITY=Resistencia
ENV REACT_APP_WEATHER_API_KEY=$REACT_APP_WEATHER_API_KEY \
    REACT_APP_DEFAULT_CITY=$REACT_APP_DEFAULT_CITY \
    GENERATE_SOURCEMAP=false
RUN npm run build

# ---------- Runtime ----------
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

LABEL org.opencontainers.image.title="devops-project-06" \
      org.opencontainers.image.description="React Weather App servida con Nginx"

COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=nginx:nginx /app/build /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
