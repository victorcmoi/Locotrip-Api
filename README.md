# Locotrip API - Documentation

API REST complète pour la plateforme Locotrip avec NestJS et Prisma.

## 📚 Modules et Endpoints

### 👥 Utilisateurs (`/users`)
- `POST /users` - Créer un utilisateur
- `GET /users` - Liste des utilisateurs
- `GET /users/:id` - Détails d'un utilisateurs
- `GET /users/email/:email` - Recherche par email
- `PUT /users/:id` - Mettre à jour un utilisateur
- `DELETE /users/:id` - Supprimer un utilisateur

### 🎯 Guides (`/guides`)
- `POST /guides` - Créer un guide
- `GET /guides` - Liste des guides
- `GET /guides/:id` - Détails d'un guide
- `GET /guides/user/:userId` - Guides d'un utilisateur
- `PUT /guides/:id` - Mettre à jour un guide
- `DELETE /guides/:id` - Supprimer un guide

#### Documents
- `POST /guides/:guideId/documents` - Ajouter un document
- `GET /guides/:guideId/documents` - Documents d'un guide

#### Disponibilités
- `POST /guides/:guideId/availability` - Ajouter une disponibilité
- `GET /guides/:guideId/availability` - Disponibilités d'un guide

#### Boosts
- `POST /guides/:guideId/boosts` - Acheter un boost
- `GET /guides/:guideId/boosts` - Boosts d'un guide

### 🌍 Expériences

#### Villes (`/cities`)
- `POST /cities` - Créer une ville
- `GET /cities` - Liste des villes
- `GET /cities/:id` - Détails d'une ville
- `PUT /cities/:id` - Mettre à jour une ville
- `DELETE /cities/:id` - Supprimer une ville

#### Expériences (`/experiences`)
- `POST /experience` - Créer une expérience
- `GET /experiences` - Liste des expériences
- `GET /experience/:id` - Détails d'une expérience
- `GET /experiences/city/:villeId` - Expériences par ville
- `GET /experiences/guide/:guideId` - Expériences par guide
- `PUT /experience/:id` - Mettre à jour une expérience
- `DELETE /experience/:id` - Supprimer une expérience

#### Catégories (`/categories`)
- `POST /categories` - Créer une catégorie
- `GET /categories` - Liste des catégories
- `GET /categories/:id` - Détails d'une catégorie
- `PUT /categories/:id` - Mettre à jour une catégorie
- `DELETE /categories/:id` - Supprimer une catégorie

### 📅 Réservations (`/bookings`)
- `POST /bookings` - Créer une réservation
- `GET /bookings` - Liste des réservations
- `GET /bookings/:id` - Détails d'une réservation
- `GET /bookings/user/:userId` - Réservations d'un utilisateur
- `PUT /bookings/:id` - Mettre à jour une réservation
- `DELETE /bookings/:id` - Supprimer une réservation

#### Paiements
- `POST /bookings/:bookingId/payments` - Créer un paiement
- `GET /bookings/:bookingId/payments` - Paiements d'une réservation
- `GET /payments` - Liste des paiements
- `GET /payments/:id` - Détails d'un paiement

#### Litiges
- `POST /bookings/:bookingId/dispute` - Créer un litige
- `GET /disputes` - Liste des litiges
- `GET /dispute/:id` - Détails d'un litige
- `GET /dispute/status/:status` - Litiges par status
- `PUT /disputes/:id` - Mettre à jour un litige

### ⭐ Avis et Abonnements

#### Avis (`/reviews`)
- `POST /reviews` - Créer un avis
- `GET /reviews` - Liste des avis
- `GET /reviews/:id` - Détails d'un avis
- `GET /reviews/experience/:experienceId` - Avis d'une expérience
- `GET /reviews/user/:userId` - Avis d'un utilisateur
- `PUT /reviews/:id` - Mettre à jour un avis
- `DELETE /reviews/:id` - Supprimer un avis

#### Abonnements (`/subscriptions`)
- `POST /subscriptions` - Créer un abonnement
- `GET /subscriptions` - Liste des abonnements
- `GET /subscriptions/actifs` - Abonnements actifs
- `GET /subscriptions/:id` - Détails d'un abonnement
- `GET /subscriptions/user/:userId` - Abonnements d'un utilisateur
- `PUT /subscriptions/:id` - Mettre à jour un abonnement

### 💬 Messagerie

#### Conversations (`/conversations`)
- `POST /conversations` - Créer une conversation
- `GET /conversations` - Liste des conversations
- `GET /conversations/:id` - Détails d'une conversation
- `GET /conversations/booking/:bookingId` - Conversations d'une réservation
- `DELETE /conversations/:id` - Supprimer une conversation

#### Messages
- `POST /conversations/:conversationId/messages` - Envoyer un message
- `GET /conversations/:conversationId/messages` - Messages d'une conversation
- `GET /messages` - Liste des messages
- `GET /messages/:id` - Détails d'un message

### 🎫 Support

#### Tickets (`/support-tickets`)
- `POST /support-tickets` - Créer un ticket
- `GET /support-tickets` - Liste des tickets
- `GET /support-tickets/:id` - Détails d'un ticket
- `GET /support-tickets/status/:status` - Tickets par status
- `GET /support-tickets/user/:userId` - Tickets d'un utilisateur
- `PUT /support-tickets/:id` - Mettre à jour un ticket
- `DELETE /support-tickets/:id` - Supprimer un ticket

#### Messages du ticket
- `POST /support-tickets/:ticketId/messages` - Ajouter un message
- `GET /support-tickets/:ticketId/messages` - Messages d'un ticket

#### Notifications (`/notifications`)
- `POST /notifications` - Créer une notification
- `GET /notifications` - Liste des notifications
- `GET /notifications/:id` - Détails d'une notification
- `GET /notifications/user/:userId` - Notifications d'un utilisateur
- `GET /notifications/user/:userId/non-lues` - Notifications non lues
- `PATCH /notifications/:id/marquer-lue` - Marquer comme lue
- `PUT /notifications/:id` - Mettre à jour une notification
- `DELETE /notifications/:id` - Supprimer une notification

### 📸 Media (`/media`)
- `POST /media` - Upload un média
- `GET /media` - Liste des médias
- `GET /media?type=photo` - Filtrer par type
- `GET /media/:id` - Détails d'un média
- `GET /media/entity/:entityType/:entityId` - Médias d'une entité
- `PUT /media/:id` - Mettre à jour un média
- `DELETE /media/:id` - Supprimer un média

### 💱 Devises

#### Devises (`/currencies`)
- `POST /currencies` - Créer une devise
- `GET /currencies` - Liste des devises
- `GET /currencies/:code` - Détails d'une devise (ex: EUR, USD)
- `PUT /currencies/:code` - Mettre à jour une devise
- `DELETE /currencies/:code` - Supprimer une devise

#### Prix par devise (`/experience-price`)
- `POST /experience-price` - Ajouter un prix
- `GET /experience-price` - Liste des prix
- `GET /experience-price/experience/:experienceId` - Prix d'une expérience
- `GET /experience-price/currency/:currencyCode` - Prix par devise
- `PUT /experience-price/:experienceId/:currencyCode` - Mettre à jour un prix
- `DELETE /experience-price/:experienceId/:currencyCode` - Supprimer un prix

### 🎁 Boost Offers (`/boost-offers`)
- `POST /boost-offers` - Créer une offre
- `GET /boost-offers` - Liste des offres
- `GET /boost-offers/:id` - Détails d'une offre
- `PUT /boost-offers/:id` - Mettre à jour une offre
- `DELETE /boost-offers/:id` - Supprimer une offre

## 🔧 Installation

```bash
# Installer les dépendances
make install

# Créer un fichier .env
make setup

# Créer une base de données Prisma Postgres
# Rendez-vous sur console.prisma.io et créez une nouvelle base
# Configurer le fichier .env en vous basant sur .env.example

# Générer le client Prisma et appliquer les migrations
make generate
make migrate

# Seeder la base
make seed

# Lancer le serveur
make dev

# Ouvrir Prisma Studio
make studio
```