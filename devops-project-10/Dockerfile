# syntax=docker/dockerfile:1

FROM golang:1.23-alpine AS build

WORKDIR /src

COPY go.mod ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/app .

FROM gcr.io/distroless/static-debian12:nonroot AS runtime

LABEL org.opencontainers.image.title="devops-project-10" \
      org.opencontainers.image.description="Go web app servida desde una imagen distroless" \
      org.opencontainers.image.source="https://github.com/roxsross/roxs-devops-projects"

ENV PORT=8080

WORKDIR /app
COPY --from=build /out/app /app/app
COPY --from=build /src/static /app/static

USER nonroot:nonroot
EXPOSE 8080

ENTRYPOINT ["/app/app"]
