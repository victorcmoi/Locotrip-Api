# 🌍 Locotrip API

API REST pour la plateforme Locotrip - service de réservation d'expériences touristiques avec des guides locaux.

## 📋 Table des matières

- [Technologies](#technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#configuration)
- [Lancer l'application](#-lancer-lapplication)
- [Architecture](#-architecture)
- [Modules disponibles](#-modules-disponibles)
- [Documentation API](#-documentation-api)
- [Scripts disponibles](#-scripts-disponibles)
- [Base de données](#base-de-données)

## 🛠️ Technologies

### Stack principal

- **[NestJS](https://nestjs.com/)** `v11` - Framework backend progressif basé sur TypeScript
- **[Prisma](https://www.prisma.io/)** `v7` - ORM nouvelle génération avec PostgreSQL
- **[PostgreSQL](https://www.postgresql.org/)** - Base de données relationnelle
- **[TypeScript](https://www.typescriptlang.org/)** `v5` - Langage typé

### Authentification & Sécurité

- **JWT** - Authentification par tokens (access & refresh tokens)
- **bcrypt** - Hachage des mots de passe
- **Helmet** - Sécurisation des en-têtes HTTP
- **Throttler** - Rate limiting et protection contre le spam
- **class-validator** - Validation des données entrantes

### Intégrations externes

- **[Stripe](https://stripe.com/)** - Gestion des paiements et transactions
- **[MinIO](https://min.io/)** - Stockage d'objets (images, vidéos, documents)
- **[Mailgun](https://www.mailgun.com/)** - Envoi d'emails transactionnels
- **[Twilio](https://www.twilio.com/)** - Notifications SMS

### DevOps & Documentation

- **Docker** & **Docker Compose** - Conteneurisation
- **[Swagger](https://swagger.io/)** / **OpenAPI** - Documentation API interactive
- **Makefile** - Automatisation des commandes

## 📦 Prérequis

- **Node.js** `>= 20.0.0`
- **npm** ou **yarn**
- **PostgreSQL** `>= 14` (ou via Docker)
- **Docker** & **Docker Compose** (optionnel mais recommandé)

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone <repository-url>
cd Locotrip-Api
```

### 2. Installer les dépendances

```bash
make install
# ou
npm install
```

### 3. Configuration de l'environnement

Créer le fichier `.env` à partir du template :

```bash
make setup
# ou
cp .env.sample .env
```

Éditer le fichier `.env` avec vos propres valeurs.

## ⚙️ Configuration

Le fichier `.env` contient toutes les variables d'environnement nécessaires :

### Configuration de base

```env
API_PORT=3000                        # Port de l'API
NODE_ENV=development                 # Environnement (development, production)
```

### Base de données

```env
DATABASE_URL="postgresql://user:password@localhost:5432/locotrip"
```

### JWT

```env
JWT_SECRET=votre_secret_jwt_access_token
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=votre_secret_jwt_refresh_token
JWT_REFRESH_EXPIRATION=7d
```

### Stripe

```env
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_PRIVATE_KEY=sk_test_xxxxx
```

### MinIO (stockage de fichiers)

```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ROOT_USER=minio
MINIO_ROOT_PASSWORD=minio123
```

### Mailgun (emails)

```env
MAILGUN_API_KEY_SANDBOX=your_sandbox_key
MAILGUN_SANDBOX_DOMAIN=your_sandbox_domain
FROM_EMAIL=noreply@loco-trip.com
```

Voir `.env.sample` pour la liste complète des variables.

## 🎬 Lancer l'application

### Option 1 : Avec Docker (recommandé)

Lance PostgreSQL et MinIO automatiquement :

```bash
# Lancer les services en arrière-plan
make dc-up

# Générer le client Prisma
make gen

# Appliquer les migrations
make migrate

# (Optionnel) Peupler la base avec des données de test
make seed

# Lancer l'API en développement
make dev
```

L'API sera accessible sur [http://localhost:3000](http://localhost:3000)

### Option 2 : En local (sans Docker)

Prérequis : PostgreSQL et MinIO déjà installés et en cours d'exécution.

```bash
# Générer le client Prisma
make gen

# Appliquer les migrations
make migrate

# (Optionnel) Peupler la base
make seed

# Lancer l'API
make dev
```

### Arrêter les services Docker

```bash
make dc-down           # Arrêter les conteneurs
make dc-clean          # Arrêter et supprimer les volumes
```

## 🏗️ Architecture

L'API suit l'architecture modulaire de NestJS avec une séparation claire des responsabilités :

```text
src/
├── app.module.ts              # Module racine
├── main.ts                    # Point d'entrée de l'application
├── prisma.service.ts          # Service Prisma global
│
├── auth/                      # Authentification (JWT, guards)
├── users/                     # Gestion des utilisateurs
├── guides/                    # Profils et informations guides
├── experiences/               # Expériences touristiques
├── bookings/                  # Réservations
├── reviews/                   # Avis et évaluations
├── messagerie/                # Système de messagerie
├── support/                   # Support client et litiges
├── media/                     # Gestion des fichiers
├── stripe/                    # Intégration paiements
├── currencies/                # Devises et conversions
├── statistics/                # Statistiques et analytics
├── search/                    # Recherche d'expériences
├── video/                     # Gestion vidéos
├── contact/                   # Formulaire de contact
├── mail/                      # Service d'envoi d'emails
├── minio/                     # Service MinIO
│
├── common/                    # Guards, decorators, pipes partagés
└── generated/                 # Code auto-généré (Prisma)
```

### Patterns utilisés

- **Modules** : Chaque fonctionnalité est encapsulée dans son propre module
- **Services** : Logique métier et interactions avec la base de données
- **Controllers** : Gestion des routes et des requêtes HTTP
- **DTOs** : Validation et transformation des données (class-validator)
- **Guards** : Protection des routes (authentification, autorisation)
- **Interceptors** : Rate limiting, logging
- **Prisma** : Accès unifié à la base de données

## 📦 Modules disponibles

| Module | Description | Endpoints principaux |
| --- | --- | --- |
| **Auth** | Authentification JWT, inscription, connexion | `/auth/login`, `/auth/register`, `/auth/refresh` |
| **Users** | Profils utilisateurs, préférences | `/users`, `/users/:id` |
| **Guides** | Profils guides, disponibilités | `/guides`, `/guides/:id` |
| **Experiences** | Expériences touristiques, catégories, villes | `/experiences`, `/experiences/:id` |
| **Bookings** | Réservations, disponibilités | `/bookings`, `/bookings/:id` |
| **Reviews** | Avis et notations | `/reviews` |
| **Messagerie** | Conversations entre utilisateurs | `/messagerie` |
| **Support** | Tickets de support, litiges | `/support` |
| **Media** | Upload/download de fichiers | `/media` |
| **Stripe** | Paiements, webhooks Stripe | `/stripe` |
| **Currencies** | Devises, taux de change | `/currencies` |
| **Statistics** | Statistiques de la plateforme | `/statistics` |
| **Search** | Recherche et filtres avancés | `/search` |
| **Video** | Gestion des vidéos | `/video` |
| **Contact** | Formulaire de contact | `/contact` |

## 📚 Documentation API

Une fois l'API lancée, accédez à la **documentation Swagger** interactive :

### 🔗 [http://localhost:3000/api](http://localhost:3000/api)

La documentation inclut :

- ✅ Tous les endpoints disponibles
- ✅ Schémas de données (DTOs)
- ✅ Codes de réponse HTTP
- ✅ Interface de test intégrée
- ✅ Authentification JWT directement dans l'interface

### Utilisation de l'authentification

1. Créer un compte via `/auth/register` ou se connecter via `/auth/login`
2. Copier le `access_token` reçu
3. Cliquer sur **Authorize** 🔓 en haut à droite
4. Coller le token et valider
5. Tous les endpoints protégés sont maintenant accessibles

## 🛠️ Scripts disponibles

Le projet utilise un **Makefile** pour simplifier les commandes courantes :

### Commandes de développement

```bash
make help              # Afficher toutes les commandes disponibles
make install           # Installer les dépendances npm
make dev               # Lancer l'API en mode développement
make build             # Compiler le projet
```

### BDD

```bash
make gen               # Générer le client Prisma
make migrate           # Créer et appliquer une migration
make seed              # Peupler la base avec des données de test
make studio            # Ouvrir Prisma Studio (interface graphique)
make reset             # Réinitialiser complètement la base
```

### Docker (PostgreSQL + MinIO)

```bash
make dc-up             # Lancer les services en arrière-plan
make dc-dev            # Lancer avec logs en temps réel
make dc-down           # Arrêter les conteneurs
make dc-logs           # Voir les logs des services
make dc-restart        # Redémarrer les conteneurs
make dc-clean          # Arrêter et supprimer les volumes
```

### Scripts npm disponibles

```bash
npm run start:dev      # Développement avec hot-reload
npm run start:prod     # Production
npm run build          # Build de production
npm run lint           # Linter le code
npm run format         # Formater le code (Prettier)
npm run test           # Tests unitaires
npm run test:e2e       # Tests end-to-end
```

## 🗄️ Base de données

### Schéma Prisma

Le schéma de la base de données se trouve dans `prisma/schema.prisma`.

### Principales entités

- **User** : Utilisateurs de la plateforme
- **Guide** : Profils des guides locaux
- **Experience** : Expériences touristiques proposées
- **Booking** : Réservations effectuées
- **Review** : Avis et évaluations
- **Message** : Messages entre utilisateurs
- **Payment** : Transactions financières
- **Media** : Fichiers uploadés
- **City** : Villes disponibles
- **Category** : Catégories d'expériences

### Migrations

Les migrations sont versionnées dans `prisma/migrations/`.

```bash
# Créer une nouvelle migration
make migrate

# Visualiser la base avec Prisma Studio
make studio
# Accessible sur http://localhost:5555
```

### Seed de données

```bash
# Peupler la base avec des données de démonstration
make seed
```

Le fichier `prisma/seed.ts` contient les données initiales (utilisateurs de test, catégories, villes, etc.).

## 📝 Notes supplémentaires

### Rate Limiting

L'API implémente du rate limiting avec trois niveaux :

- **short** : 8 requêtes / seconde
- **medium** : 25 requêtes / 10 secondes
- **long** : 150 requêtes / minute

### CORS

Le CORS est configuré pour accepter toutes les origines en développement. **À restreindre en production.**

### Sécurité

- Mots de passe hachés avec bcrypt
- Tokens JWT avec refresh tokens
- Validation stricte des données entrantes
- Protection des en-têtes HTTP (Helmet)
- Rate limiting activé

---
