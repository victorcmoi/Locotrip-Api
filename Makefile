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
	@echo "  make generate      - Generer le client Prisma"
	@echo "  make seed          - Peupler la base de donnees"
	@echo "  make studio        - Ouvrir Prisma Studio"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up     - Lancer tous les services en arriere-plan"
	@echo "  make docker-dev    - Lancer en mode dev avec logs"
	@echo "  make docker-down   - Arreter les conteneurs"
	@echo "  make docker-logs   - Voir les logs"
	@echo "  make docker-restart - Redemarrer les conteneurs"
	@echo "  make docker-clean  - Arreter et supprimer les volumes"
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
	npx prisma studio --config prisma/prisma.config.ts --port 5555

generate: ## Generer le client Prisma
	npx prisma generate

seed: ## Peupler la base
	npx prisma db seed --config prisma/prisma.config.ts

reset: ## Reinitialiser la base de donnees
	npx prisma migrate reset

# === Docker ===

docker-up: ## Lancer tous les services (API + BDD + Prisma Studio)
	docker-compose up -d

docker-dev: ## Lancer en mode developpement avec logs
	docker-compose up

docker-down: ## Arreter les conteneurs
	docker-compose down

docker-logs: ## Voir les logs
	docker-compose logs -f

docker-restart: ## Redemarrer les conteneurs
	docker-compose restart

docker-clean: ## Arreter et supprimer les volumes
	docker-compose down -v
