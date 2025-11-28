# Locotrip API

API REST pour la plateforme Locotrip.

## 🛠️ Technologies

- **NestJS** - Framework backend
- **Prisma 7** - ORM avec PostgreSQL
- **PostgreSQL** - Base de données
- **Docker** - Conteneurisation
- **Swagger** - Documentation API interactive
- **JWT** - Authentification
- **Stripe** - Paiements

## 🚀 Démarrage rapide

### Avec Docker (recommandé)

Le projet dispose d'un **Makefile** avec des commandes simples et d'un **Docker Compose** qui lance automatiquement PostgreSQL et l'API.

```bash
# Voir toutes les commandes disponibles
make help

# Lancer tous les services
make docker-up
```

L'API sera accessible sur `http://localhost:3333` et la documentation Swagger sur `http://localhost:3333/api`.

### En local (sans Docker)

```bash
make install   # Installer les dépendances
make setup     # Créer le fichier .env
make migrate   # Appliquer les migrations
make seed      # Peupler la base (optionnel)
make dev       # Lancer l'API
```

## 📋 Commandes principales

Tapez `make help` pour voir toutes les commandes disponibles.

**Les plus utiles :**
- `make docker-up` - Lancer tous les services
- `make dev` - Lancer l'API en local
- `make migrate` - Appliquer les migrations
- `make studio` - Ouvrir Prisma Studio
- `make seed` - Peupler la base de données

## 📚 Documentation API

Une fois l'API lancée, accédez à la **documentation Swagger** complète avec tous les endpoints :

**http://localhost:3333/api**
