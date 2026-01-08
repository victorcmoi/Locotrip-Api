/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `guide` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "review" ADD COLUMN     "title" VARCHAR(150);

-- CreateIndex
CREATE UNIQUE INDEX "guide_user_id_key" ON "guide"("user_id");
