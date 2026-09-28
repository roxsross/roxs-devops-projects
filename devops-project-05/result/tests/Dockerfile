# syntax=docker/dockerfile:1
# Imagen de tests E2E: Playwright + Chromium (sustituye a PhantomJS, sin soporte desde 2018).

FROM mcr.microsoft.com/playwright:v1.49.1-noble

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY . .
RUN chmod +x tests.sh

USER pwuser

CMD ["./tests.sh"]
