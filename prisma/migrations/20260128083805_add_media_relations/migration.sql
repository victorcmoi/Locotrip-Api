/*
  Warnings:

  - A unique constraint covering the columns `[guide_id]` on the table `media` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[review_id]` on the table `media` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "media" ADD COLUMN     "experience_id" UUID,
ADD COLUMN     "guide_id" UUID,
ADD COLUMN     "review_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "media_guide_id_key" ON "media"("guide_id");

-- CreateIndex
CREATE UNIQUE INDEX "media_review_id_key" ON "media"("review_id");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "guide"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "experience"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "review"("id") ON DELETE SET NULL ON UPDATE CASCADE;
