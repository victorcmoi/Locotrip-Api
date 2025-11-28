/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `city` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `city` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `experience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "city" ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image_url" VARCHAR(255),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "slug" VARCHAR(150) NOT NULL;

-- AlterTable
ALTER TABLE "experience" ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(6),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "meeting_latitude" DOUBLE PRECISION,
ADD COLUMN     "meeting_longitude" DOUBLE PRECISION,
ADD COLUMN     "meeting_point" VARCHAR(255),
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE "guide" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "suspended_at" TIMESTAMP(6),
ADD COLUMN     "suspension_reason" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "birth_date" DATE,
ADD COLUMN     "data_processing_consent" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "data_processing_consent_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(6),
ADD COLUMN     "deleted_reason" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "marketing_consent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "marketing_consent_date" TIMESTAMP(6),
ADD COLUMN     "phone" VARCHAR(20),
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL;

-- CreateTable
CREATE TABLE "address" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "street" VARCHAR(150) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100),
    "postal_code" VARCHAR(20) NOT NULL,
    "country" VARCHAR(50) NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_access_log" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "accessed_by" UUID NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "ip_address" VARCHAR(45),
    "reason" TEXT,
    "access_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_access_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "address_user_id_key" ON "address"("user_id");

-- CreateIndex
CREATE INDEX "address_user_id_idx" ON "address"("user_id");

-- CreateIndex
CREATE INDEX "data_access_log_user_id_idx" ON "data_access_log"("user_id");

-- CreateIndex
CREATE INDEX "data_access_log_accessed_by_idx" ON "data_access_log"("accessed_by");

-- CreateIndex
CREATE INDEX "data_access_log_access_date_idx" ON "data_access_log"("access_date");

-- CreateIndex
CREATE UNIQUE INDEX "city_slug_key" ON "city"("slug");

-- CreateIndex
CREATE INDEX "city_slug_idx" ON "city"("slug");

-- CreateIndex
CREATE INDEX "city_is_active_idx" ON "city"("is_active");

-- CreateIndex
CREATE INDEX "experience_is_active_idx" ON "experience"("is_active");

-- CreateIndex
CREATE INDEX "experience_is_published_idx" ON "experience"("is_published");

-- CreateIndex
CREATE INDEX "guide_is_active_idx" ON "guide"("is_active");

-- CreateIndex
CREATE INDEX "user_is_active_idx" ON "user"("is_active");

-- CreateIndex
CREATE INDEX "user_email_is_active_idx" ON "user"("email", "is_active");

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
