# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src
COPY Worker.csproj ./
RUN dotnet restore Worker.csproj
COPY . .
RUN dotnet publish Worker.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/runtime:8.0-alpine AS runtime

LABEL org.opencontainers.image.title="devops-project-05-worker" \
      org.opencontainers.image.description="Worker .NET que consume votos de Redis y los persiste en Postgres"

ENV DOTNET_EnableDiagnostics=0

RUN addgroup -S -g 1001 worker && adduser -S -u 1001 -G worker worker

WORKDIR /app
COPY --from=build --chown=worker:worker /app/publish ./

USER worker

ENTRYPOINT ["dotnet", "Worker.dll"]
