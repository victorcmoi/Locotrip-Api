-- CreateTable
CREATE TABLE "public"."utilisateur" (
    "id" UUID NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "prenom" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "mot_de_passe" VARCHAR(255) NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "date_creation" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."guide" (
    "id" UUID NOT NULL,
    "utilisateur_id" UUID NOT NULL,
    "bio" TEXT,
    "langues" VARCHAR(100),
    "experience_annees" INTEGER,
    "statut_guide" VARCHAR(20) NOT NULL,
    "carte_pro" BOOLEAN NOT NULL DEFAULT false,
    "pays" VARCHAR(50),
    "date_demande_carte" TIMESTAMP(6),
    "date_verification_carte" TIMESTAMP(6),
    "commentaire_interne" TEXT,
    "date_creation" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_maj" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "guide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."guide_document" (
    "id" UUID NOT NULL,
    "guide_id" UUID NOT NULL,
    "type_document" VARCHAR(50) NOT NULL,
    "verification_status" VARCHAR(20) NOT NULL,
    "commentaire_verif" TEXT,
    "date_upload" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_verification" TIMESTAMP(6),

    CONSTRAINT "guide_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."guide_availability" (
    "id" UUID NOT NULL,
    "guide_id" UUID NOT NULL,
    "date_debut" TIMESTAMP(6) NOT NULL,
    "date_fin" TIMESTAMP(6) NOT NULL,
    "statut" VARCHAR(20) NOT NULL,

    CONSTRAINT "guide_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."boost_offer" (
    "id" UUID NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "duree_jours" INTEGER NOT NULL,
    "pourcentage_reduction" INTEGER NOT NULL,
    "prix" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "boost_offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."guide_boost" (
    "id" UUID NOT NULL,
    "guide_id" UUID NOT NULL,
    "boost_offer_id" UUID NOT NULL,
    "date_achat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_expiration" TIMESTAMP(6) NOT NULL,
    "statut" VARCHAR(20) NOT NULL,

    CONSTRAINT "guide_boost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ville" (
    "id" UUID NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "pays" VARCHAR(50) NOT NULL,
    "description" TEXT,

    CONSTRAINT "ville_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."experience" (
    "id" UUID NOT NULL,
    "titre" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "prix" DECIMAL(10,2) NOT NULL,
    "duree" INTEGER NOT NULL,
    "ville_id" UUID NOT NULL,
    "guide_id" UUID NOT NULL,
    "capacite_max" INTEGER,

    CONSTRAINT "experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categorie" (
    "id" UUID NOT NULL,
    "nom" VARCHAR(50) NOT NULL,

    CONSTRAINT "categorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."experience_categorie" (
    "experience_id" UUID NOT NULL,
    "categorie_id" UUID NOT NULL,

    CONSTRAINT "experience_categorie_pkey" PRIMARY KEY ("experience_id","categorie_id")
);

-- CreateTable
CREATE TABLE "public"."reservation" (
    "id" UUID NOT NULL,
    "utilisateur_id" UUID NOT NULL,
    "experience_id" UUID NOT NULL,
    "date_reservation" TIMESTAMP(6) NOT NULL,
    "statut" VARCHAR(20) NOT NULL,
    "nombre_participants" INTEGER NOT NULL,
    "prix_total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."paiement" (
    "id" UUID NOT NULL,
    "reservation_id" UUID NOT NULL,
    "montant" DECIMAL(10,2) NOT NULL,
    "date_paiement" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "methode" VARCHAR(50) NOT NULL,
    "statut" VARCHAR(20) NOT NULL,
    "stripe_id" VARCHAR(100),

    CONSTRAINT "paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."litige" (
    "id" UUID NOT NULL,
    "reservation_id" UUID NOT NULL,
    "utilisateur_id" UUID NOT NULL,
    "motif" TEXT NOT NULL,
    "statut" VARCHAR(20) NOT NULL,
    "date_creation" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_resolution" TIMESTAMP(6),
    "admin_id" UUID,

    CONSTRAINT "litige_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."avis" (
    "id" UUID NOT NULL,
    "utilisateur_id" UUID NOT NULL,
    "experience_id" UUID NOT NULL,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT,
    "date_avis" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."abonnement" (
    "id" UUID NOT NULL,
    "utilisateur_id" UUID NOT NULL,
    "type_abonnement" VARCHAR(50) NOT NULL,
    "date_debut" TIMESTAMP(6) NOT NULL,
    "date_fin" TIMESTAMP(6) NOT NULL,
    "statut" VARCHAR(20) NOT NULL,

    CONSTRAINT "abonnement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."conversation" (
    "id" UUID NOT NULL,
    "reservation_id" UUID NOT NULL,
    "date_creation" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."message" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "auteur_id" UUID NOT NULL,
    "contenu" TEXT NOT NULL,
    "date_envoi" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media" (
    "id" UUID NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "type_media" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "date_upload" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."support_ticket" (
    "id" UUID NOT NULL,
    "utilisateur_id" UUID NOT NULL,
    "sujet" VARCHAR(150) NOT NULL,
    "statut" VARCHAR(20) NOT NULL,
    "date_creation" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_fermeture" TIMESTAMP(6),

    CONSTRAINT "support_ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ticket_message" (
    "id" UUID NOT NULL,
    "ticket_id" UUID NOT NULL,
    "auteur_id" UUID NOT NULL,
    "contenu" TEXT NOT NULL,
    "date_envoi" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notification" (
    "id" UUID NOT NULL,
    "utilisateur_id" UUID NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "contenu" TEXT NOT NULL,
    "lu" BOOLEAN NOT NULL DEFAULT false,
    "date_envoi" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."devise" (
    "code" CHAR(3) NOT NULL,
    "nom" VARCHAR(50) NOT NULL,
    "taux_change" DECIMAL(10,4) NOT NULL,

    CONSTRAINT "devise_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "public"."experience_prix" (
    "experience_id" UUID NOT NULL,
    "devise_code" CHAR(3) NOT NULL,
    "prix" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "experience_prix_pkey" PRIMARY KEY ("experience_id","devise_code")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateur_email_key" ON "public"."utilisateur"("email");

-- CreateIndex
CREATE INDEX "guide_utilisateur_id_idx" ON "public"."guide"("utilisateur_id");

-- CreateIndex
CREATE INDEX "guide_document_guide_id_idx" ON "public"."guide_document"("guide_id");

-- CreateIndex
CREATE INDEX "guide_availability_guide_id_idx" ON "public"."guide_availability"("guide_id");

-- CreateIndex
CREATE INDEX "guide_boost_guide_id_idx" ON "public"."guide_boost"("guide_id");

-- CreateIndex
CREATE INDEX "guide_boost_boost_offer_id_idx" ON "public"."guide_boost"("boost_offer_id");

-- CreateIndex
CREATE INDEX "experience_ville_id_idx" ON "public"."experience"("ville_id");

-- CreateIndex
CREATE INDEX "experience_guide_id_idx" ON "public"."experience"("guide_id");

-- CreateIndex
CREATE INDEX "experience_categorie_experience_id_idx" ON "public"."experience_categorie"("experience_id");

-- CreateIndex
CREATE INDEX "experience_categorie_categorie_id_idx" ON "public"."experience_categorie"("categorie_id");

-- CreateIndex
CREATE INDEX "reservation_utilisateur_id_idx" ON "public"."reservation"("utilisateur_id");

-- CreateIndex
CREATE INDEX "reservation_experience_id_idx" ON "public"."reservation"("experience_id");

-- CreateIndex
CREATE INDEX "paiement_reservation_id_idx" ON "public"."paiement"("reservation_id");

-- CreateIndex
CREATE INDEX "litige_reservation_id_idx" ON "public"."litige"("reservation_id");

-- CreateIndex
CREATE INDEX "litige_utilisateur_id_idx" ON "public"."litige"("utilisateur_id");

-- CreateIndex
CREATE INDEX "litige_admin_id_idx" ON "public"."litige"("admin_id");

-- CreateIndex
CREATE INDEX "avis_utilisateur_id_idx" ON "public"."avis"("utilisateur_id");

-- CreateIndex
CREATE INDEX "avis_experience_id_idx" ON "public"."avis"("experience_id");

-- CreateIndex
CREATE INDEX "abonnement_utilisateur_id_idx" ON "public"."abonnement"("utilisateur_id");

-- CreateIndex
CREATE INDEX "conversation_reservation_id_idx" ON "public"."conversation"("reservation_id");

-- CreateIndex
CREATE INDEX "message_conversation_id_idx" ON "public"."message"("conversation_id");

-- CreateIndex
CREATE INDEX "message_auteur_id_idx" ON "public"."message"("auteur_id");

-- CreateIndex
CREATE INDEX "media_entity_type_entity_id_idx" ON "public"."media"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "support_ticket_utilisateur_id_idx" ON "public"."support_ticket"("utilisateur_id");

-- CreateIndex
CREATE INDEX "ticket_message_ticket_id_idx" ON "public"."ticket_message"("ticket_id");

-- CreateIndex
CREATE INDEX "ticket_message_auteur_id_idx" ON "public"."ticket_message"("auteur_id");

-- CreateIndex
CREATE INDEX "notification_utilisateur_id_idx" ON "public"."notification"("utilisateur_id");

-- CreateIndex
CREATE INDEX "experience_prix_experience_id_idx" ON "public"."experience_prix"("experience_id");

-- CreateIndex
CREATE INDEX "experience_prix_devise_code_idx" ON "public"."experience_prix"("devise_code");

-- AddForeignKey
ALTER TABLE "public"."guide" ADD CONSTRAINT "guide_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."guide_document" ADD CONSTRAINT "guide_document_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "public"."guide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."guide_availability" ADD CONSTRAINT "guide_availability_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "public"."guide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."guide_boost" ADD CONSTRAINT "guide_boost_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "public"."guide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."guide_boost" ADD CONSTRAINT "guide_boost_boost_offer_id_fkey" FOREIGN KEY ("boost_offer_id") REFERENCES "public"."boost_offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."experience" ADD CONSTRAINT "experience_ville_id_fkey" FOREIGN KEY ("ville_id") REFERENCES "public"."ville"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."experience" ADD CONSTRAINT "experience_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "public"."guide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."experience_categorie" ADD CONSTRAINT "experience_categorie_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "public"."experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."experience_categorie" ADD CONSTRAINT "experience_categorie_categorie_id_fkey" FOREIGN KEY ("categorie_id") REFERENCES "public"."categorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservation" ADD CONSTRAINT "reservation_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservation" ADD CONSTRAINT "reservation_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "public"."experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."paiement" ADD CONSTRAINT "paiement_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."litige" ADD CONSTRAINT "litige_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."litige" ADD CONSTRAINT "litige_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."litige" ADD CONSTRAINT "litige_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avis" ADD CONSTRAINT "avis_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avis" ADD CONSTRAINT "avis_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "public"."experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."abonnement" ADD CONSTRAINT "abonnement_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversation" ADD CONSTRAINT "conversation_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."message" ADD CONSTRAINT "message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."message" ADD CONSTRAINT "message_auteur_id_fkey" FOREIGN KEY ("auteur_id") REFERENCES "public"."utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."support_ticket" ADD CONSTRAINT "support_ticket_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_message" ADD CONSTRAINT "ticket_message_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ticket_message" ADD CONSTRAINT "ticket_message_auteur_id_fkey" FOREIGN KEY ("auteur_id") REFERENCES "public"."utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."experience_prix" ADD CONSTRAINT "experience_prix_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "public"."experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."experience_prix" ADD CONSTRAINT "experience_prix_devise_code_fkey" FOREIGN KEY ("devise_code") REFERENCES "public"."devise"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
