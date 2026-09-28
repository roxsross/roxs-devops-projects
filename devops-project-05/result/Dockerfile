# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:22-alpine AS runtime

LABEL org.opencontainers.image.title="devops-project-05-result" \
      org.opencontainers.image.description="Panel de resultados de la votación"

ENV NODE_ENV=production \
    PORT=4000

WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

USER node
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -qO- "http://127.0.0.1:${PORT}/health" || exit 1

CMD ["node", "server.js"]
