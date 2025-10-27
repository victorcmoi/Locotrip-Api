# Locotrip API - Documentation

API REST complète pour la plateforme Locotrip avec NestJS et Prisma.

## 📚 Modules et Endpoints

### 👥 Utilisateurs (`/users`)
- `POST /users` - Créer un user
- `GET /users` - Liste des users
- `GET /users/:id` - Détails d'un user
- `GET /users/email/:email` - Recherche par email
- `PUT /users/:id` - Mettre à jour un user
- `DELETE /users/:id` - Supprimer un user

### 🎯 Guides (`/guides`)
- `POST /guides` - Créer un guide
- `GET /guides` - Liste des guides
- `GET /guides/:id` - Détails d'un guide
- `GET /guides/users/:userId` - Guides d'un user
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
- `POST /cities` - Créer une city
- `GET /cities` - Liste des cities
- `GET /cities/:id` - Détails d'une city
- `PUT /cities/:id` - Mettre à jour une city
- `DELETE /cities/:id` - Supprimer une city

#### Expériences (`/experiences`)
- `POST /experience` - Créer une expérience
- `GET /experiences` - Liste des expériences
- `GET /experience/:id` - Détails d'une expérience
- `GET /experiences/cities/:villeId` - Expériences par city
- `GET /experiences/guides/:guideId` - Expériences par guide
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
- `GET /bookings/users/:userId` - Réservations d'un user
- `PUT /bookings/:id` - Mettre à jour une réservation
- `DELETE /bookings/:id` - Supprimer une réservation

#### Paiements
- `POST /bookings/:bookingId/payments` - Créer un payment
- `GET /bookings/:bookingId/payments` - Paiements d'une réservation
- `GET /payments` - Liste des payments
- `GET /payments/:id` - Détails d'un payment

#### Litiges
- `POST /bookings/:bookingId/dispute` - Créer un dispute
- `GET /disputes` - Liste des disputes
- `GET /dispute/:id` - Détails d'un dispute
- `GET /dispute/status/:status` - Litiges par status
- `PUT /disputes/:id` - Mettre à jour un dispute

### ⭐ Avis et Abonnements

#### Avis (`/reviews`)
- `POST /reviews` - Créer un reviews
- `GET /reviews` - Liste des reviews
- `GET /reviews/:id` - Détails d'un reviews
- `GET /reviews/experience/:experienceId` - Avis d'une expérience
- `GET /reviews/users/:userId` - Avis d'un user
- `PUT /reviews/:id` - Mettre à jour un reviews
- `DELETE /reviews/:id` - Supprimer un reviews

#### Abonnements (`/subscriptions`)
- `POST /subscriptions` - Créer un subscription
- `GET /subscriptions` - Liste des subscriptions
- `GET /subscriptions/actifs` - Abonnements actifs
- `GET /subscriptions/:id` - Détails d'un subscription
- `GET /subscriptions/users/:userId` - Abonnements d'un user
- `PUT /subscriptions/:id` - Mettre à jour un subscription

### 💬 Messagerie

#### Conversations (`/conversations`)
- `POST /conversations` - Créer une conversation
- `GET /conversations` - Liste des conversations
- `GET /conversations/:id` - Détails d'une conversation
- `GET /conversations/bookings/:bookingId` - Conversations d'une réservation
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
- `GET /support-tickets/users/:userId` - Tickets d'un user
- `PUT /support-tickets/:id` - Mettre à jour un ticket
- `DELETE /support-tickets/:id` - Supprimer un ticket

#### Messages du ticket
- `POST /support-tickets/:ticketId/messages` - Ajouter un message
- `GET /support-tickets/:ticketId/messages` - Messages d'un ticket

#### Notifications (`/notifications`)
- `POST /notifications` - Créer une notification
- `GET /notifications` - Liste des notifications
- `GET /notifications/:id` - Détails d'une notification
- `GET /notifications/users/:userId` - Notifications d'un user
- `GET /notifications/users/:userId/non-lues` - Notifications non lues
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
- `POST /currencies` - Créer une currency
- `GET /currencies` - Liste des currencies
- `GET /currencies/:code` - Détails d'une currency (ex: EUR, USD)
- `PUT /currencies/:code` - Mettre à jour une currency
- `DELETE /currencies/:code` - Supprimer une currency

#### Prix par currency (`/experience-price`)
- `POST /experience-price` - Ajouter un price
- `GET /experience-price` - Liste des price
- `GET /experience-price/experience/:experienceId` - Prix d'une expérience
- `GET /experience-price/currency/:currencyCode` - Prix par currency
- `PUT /experience-price/:experienceId/:currencyCode` - Mettre à jour un price
- `DELETE /experience-price/:experienceId/:currencyCode` - Supprimer un price

### 🎁 Boost Offers (`/boost-offers`)
- `POST /boost-offers` - Créer une offre
- `GET /boost-offers` - Liste des offres
- `GET /boost-offers/:id` - Détails d'une offre
- `PUT /boost-offers/:id` - Mettre à jour une offre
- `DELETE /boost-offers/:id` - Supprimer une offre

## 🔧 Installation

```bash
# Installer les dépendances
npm install

# Créer une base de données Prisma Postgres
# Rendez-vous sur console.prisma.io et créez une nouvelle base
# Copiez l'URL de connexion dans votre fichier .env

# Configurer le fichier .env
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=VOTRE_API_KEY"

# Générer le client Prisma et appliquer les migrations
npx prisma generate
npx prisma migrate dev --name init

# 5. Lancer le serveur
npm run start:dev

# Ouvrir Prisma Studio
npx prisma studio

# Seeder la base
npm run prisma:seed
```