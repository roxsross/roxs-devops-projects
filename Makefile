
.DEFAULT_GOAL := help
COMPOSE ?= docker compose
PROJECTS := 00 01 02 03 04 05 06 07 08 09 10

# El proyecto 04 usa compose.yml (convención Compose v2); el resto docker-compose.yml.
compose_file = $(firstword $(wildcard devops-project-$(1)/docker-compose.yml devops-project-$(1)/compose.yml))

.PHONY: help
help: ## Muestra esta ayuda
	@grep -hE '^[a-zA-Z0-9_%-]+:.*?## ' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'

.PHONY: up-%
up-%: ## Levanta un proyecto (ej: make up-05)
	$(COMPOSE) -f $(call compose_file,$*) up -d --build

.PHONY: down-%
down-%: ## Baja un proyecto (ej: make down-05)
	$(COMPOSE) -f $(call compose_file,$*) down -v

.PHONY: logs-%
logs-%: ## Sigue los logs de un proyecto (ej: make logs-05)
	$(COMPOSE) -f $(call compose_file,$*) logs -f

.PHONY: build-%
build-%: ## Construye las imágenes de un proyecto (ej: make build-02)
	$(COMPOSE) -f $(call compose_file,$*) build

.PHONY: down-all
down-all: ## Baja todos los proyectos
	@for p in $(PROJECTS); do \
		f=$$(ls devops-project-$$p/docker-compose.yml devops-project-$$p/compose.yml 2>/dev/null | head -1); \
		[ -n "$$f" ] && $(COMPOSE) -f $$f down -v || true; \
	done

.PHONY: lint-docker
lint-docker: ## Analiza todos los Dockerfile con hadolint
	@find . -name 'Dockerfile*' -not -path '*/node_modules/*' -print0 \
		| xargs -0 -I{} docker run --rm -i hadolint/hadolint hadolint - < {}

.PHONY: scan-%
scan-%: ## Escanea vulnerabilidades de un proyecto con Trivy (ej: make scan-10)
	docker run --rm -v "$(PWD)/devops-project-$*:/src" \
		aquasec/trivy:latest fs --severity HIGH,CRITICAL /src

.PHONY: clean
clean: ## Limpia recursos Docker sin uso
	docker system prune -f
