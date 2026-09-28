# syntax=docker/dockerfile:1

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine AS runtime

LABEL org.opencontainers.image.title="retail-store-checkout" \
      org.opencontainers.image.description="Servicio de checkout (NestJS + Redis)" \
      org.opencontainers.image.source="https://github.com/roxsross/roxs-devops-projects"

ENV NODE_ENV=production

RUN apk add --no-cache curl tini

WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/package.json ./package.json

USER node
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
    CMD curl -fsS http://127.0.0.1:8080/health || exit 1

ENTRYPOINT ["/sbin/tini", "--", "node", "dist/main.js"]
