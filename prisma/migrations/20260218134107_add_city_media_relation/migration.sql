/*
  Warnings:

  - A unique constraint covering the columns `[city_id]` on the table `media` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "MediaType" ADD VALUE 'city_image';

-- AlterTable
ALTER TABLE "media" ADD COLUMN     "city_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "media_city_id_key" ON "media"("city_id");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE SET NULL ON UPDATE CASCADE;
