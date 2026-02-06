# Variables
COMPOSE_RUN = docker compose exec server
DB_RUN = docker compose exec db

.PHONY: help up down restart logs migrate rev db-shell clean

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

up: ## Start the containers
	docker compose up -d

down: ## Stop the containers
	docker compose down

restart: ## Restart the containers
	docker compose restart

logs: ## Follow the logs
	docker compose logs -f

## --- Database & Migrations ---

rev: ## Generate a new migration script. Usage: make rev m="migration_name"
	$(COMPOSE_RUN) alembic revision --autogenerate -m "$(m)"
	sudo chown -R $(shell id -u):$(shell id -g) backend/migrations/

migrate: ## Apply all pending migrations
	$(COMPOSE_RUN) alembic upgrade head

downgrade: ## Rollback the last migration
	$(COMPOSE_RUN) alembic downgrade -1

db-shell: ## Enter the Postgres terminal
	$(DB_RUN) psql -U postgres -d ecomdb

clean: ## Remove containers and wipe the database volumes (WARNING: Data loss)
	docker compose down -v
build: ## Rebuild the image after changing requirements
	docker compose up -d --build
