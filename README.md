# Locotrip API - Documentation

API REST complète pour la plateforme Locotrip avec NestJS et Prisma.

## 📚 Modules et Endpoints

### 👥 Utilisateurs (`/utilisateurs`)
- `POST /utilisateurs` - Créer un utilisateur
- `GET /utilisateurs` - Liste des utilisateurs
- `GET /utilisateurs/:id` - Détails d'un utilisateur
- `GET /utilisateurs/email/:email` - Recherche par email
- `PUT /utilisateurs/:id` - Mettre à jour un utilisateur
- `DELETE /utilisateurs/:id` - Supprimer un utilisateur

### 🎯 Guides (`/guides`)
- `POST /guides` - Créer un guide
- `GET /guides` - Liste des guides
- `GET /guides/:id` - Détails d'un guide
- `GET /guides/utilisateur/:utilisateurId` - Guides d'un utilisateur
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

#### Villes (`/villes`)
- `POST /villes` - Créer une ville
- `GET /villes` - Liste des villes
- `GET /villes/:id` - Détails d'une ville
- `PUT /villes/:id` - Mettre à jour une ville
- `DELETE /villes/:id` - Supprimer une ville

#### Expériences (`/experiences`)
- `POST /experiences` - Créer une expérience
- `GET /experiences` - Liste des expériences
- `GET /experiences/:id` - Détails d'une expérience
- `GET /experiences/ville/:villeId` - Expériences par ville
- `GET /experiences/guide/:guideId` - Expériences par guide
- `PUT /experiences/:id` - Mettre à jour une expérience
- `DELETE /experiences/:id` - Supprimer une expérience

#### Catégories (`/categories`)
- `POST /categories` - Créer une catégorie
- `GET /categories` - Liste des catégories
- `GET /categories/:id` - Détails d'une catégorie
- `PUT /categories/:id` - Mettre à jour une catégorie
- `DELETE /categories/:id` - Supprimer une catégorie

### 📅 Réservations (`/reservations`)
- `POST /reservations` - Créer une réservation
- `GET /reservations` - Liste des réservations
- `GET /reservations/:id` - Détails d'une réservation
- `GET /reservations/utilisateur/:utilisateurId` - Réservations d'un utilisateur
- `PUT /reservations/:id` - Mettre à jour une réservation
- `DELETE /reservations/:id` - Supprimer une réservation

#### Paiements
- `POST /reservations/:reservationId/paiements` - Créer un paiement
- `GET /reservations/:reservationId/paiements` - Paiements d'une réservation
- `GET /paiements` - Liste des paiements
- `GET /paiements/:id` - Détails d'un paiement

#### Litiges
- `POST /reservations/:reservationId/litiges` - Créer un litige
- `GET /litiges` - Liste des litiges
- `GET /litiges/:id` - Détails d'un litige
- `GET /litiges/statut/:statut` - Litiges par statut
- `PUT /litiges/:id` - Mettre à jour un litige

### ⭐ Avis et Abonnements

#### Avis (`/avis`)
- `POST /avis` - Créer un avis
- `GET /avis` - Liste des avis
- `GET /avis/:id` - Détails d'un avis
- `GET /avis/experience/:experienceId` - Avis d'une expérience
- `GET /avis/utilisateur/:utilisateurId` - Avis d'un utilisateur
- `PUT /avis/:id` - Mettre à jour un avis
- `DELETE /avis/:id` - Supprimer un avis

#### Abonnements (`/abonnements`)
- `POST /abonnements` - Créer un abonnement
- `GET /abonnements` - Liste des abonnements
- `GET /abonnements/actifs` - Abonnements actifs
- `GET /abonnements/:id` - Détails d'un abonnement
- `GET /abonnements/utilisateur/:utilisateurId` - Abonnements d'un utilisateur
- `PUT /abonnements/:id` - Mettre à jour un abonnement

### 💬 Messagerie

#### Conversations (`/conversations`)
- `POST /conversations` - Créer une conversation
- `GET /conversations` - Liste des conversations
- `GET /conversations/:id` - Détails d'une conversation
- `GET /conversations/reservation/:reservationId` - Conversations d'une réservation
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
- `GET /support-tickets/statut/:statut` - Tickets par statut
- `GET /support-tickets/utilisateur/:utilisateurId` - Tickets d'un utilisateur
- `PUT /support-tickets/:id` - Mettre à jour un ticket
- `DELETE /support-tickets/:id` - Supprimer un ticket

#### Messages du ticket
- `POST /support-tickets/:ticketId/messages` - Ajouter un message
- `GET /support-tickets/:ticketId/messages` - Messages d'un ticket

#### Notifications (`/notifications`)
- `POST /notifications` - Créer une notification
- `GET /notifications` - Liste des notifications
- `GET /notifications/:id` - Détails d'une notification
- `GET /notifications/utilisateur/:utilisateurId` - Notifications d'un utilisateur
- `GET /notifications/utilisateur/:utilisateurId/non-lues` - Notifications non lues
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

#### Devises (`/devises`)
- `POST /devises` - Créer une devise
- `GET /devises` - Liste des devises
- `GET /devises/:code` - Détails d'une devise (ex: EUR, USD)
- `PUT /devises/:code` - Mettre à jour une devise
- `DELETE /devises/:code` - Supprimer une devise

#### Prix par devise (`/experience-prix`)
- `POST /experience-prix` - Ajouter un prix
- `GET /experience-prix` - Liste des prix
- `GET /experience-prix/experience/:experienceId` - Prix d'une expérience
- `GET /experience-prix/devise/:deviseCode` - Prix par devise
- `PUT /experience-prix/:experienceId/:deviseCode` - Mettre à jour un prix
- `DELETE /experience-prix/:experienceId/:deviseCode` - Supprimer un prix

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