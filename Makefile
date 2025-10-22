# Makefile - Locotrip API
.PHONY: help install dev migrate studio docker-dev docker-prod docker-down docker-logs

help: ## Afficher l'aide
	@echo "=== Locotrip API - Commandes ==="
	@echo ""
	@echo "Installation:"
	@echo "  make install       - Installer les dependances"
	@echo "  make setup         - Creer le fichier .env"
	@echo ""
	@echo "Developpement local:"
	@echo "  make dev           - Lancer l'API"
	@echo "  make migrate       - Appliquer les migrations"
	@echo "  make studio        - Ouvrir Prisma Studio"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-dev    - Lancer en mode dev (API + Prisma Studio)"
	@echo "  make docker-down   - Arreter les conteneurs"
	@echo "  make docker-logs   - Voir les logs"
	@echo ""

# === Installation ===

install: ## Installer les dependances
	npm install

setup: ## Creer le fichier .env
	@if not exist .env (copy .env.sample .env && echo Fichier .env cree) else (echo .env existe deja)

# === Developpement local ===

dev: ## Lancer l'API en mode dev
	npm run start:dev

migrate: ## Appliquer les migrations
	npx prisma migrate dev

studio: ## Ouvrir Prisma Studio
	npx prisma studio

generate: ## Generer le client Prisma
	npx prisma generate

seed: ## Peupler la base
	npm run prisma:seed

# === Docker ===

docker-dev: ## Lancer en mode developpement
	docker-compose --env-file .env -f docker/docker-compose.dev.yml up

docker-down: ## Arreter les conteneurs
	docker-compose --env-file .env -f docker/docker-compose.dev.yml down

docker-logs: ## Voir les logs
	docker-compose --env-file .env -f docker/docker-compose.dev.yml logs -f
