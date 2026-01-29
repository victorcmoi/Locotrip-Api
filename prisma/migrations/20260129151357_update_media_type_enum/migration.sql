/*
  Warnings:

  - The values [photo,video,audio] on the enum `MediaType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DocumentType" ADD VALUE 'guide_card';
ALTER TYPE "DocumentType" ADD VALUE 'other';

-- AlterEnum
BEGIN;
CREATE TYPE "MediaType_new" AS ENUM ('profile_picture', 'pictures');
ALTER TABLE "media" ALTER COLUMN "media_type" TYPE "MediaType_new" USING ("media_type"::text::"MediaType_new");
ALTER TYPE "MediaType" RENAME TO "MediaType_old";
ALTER TYPE "MediaType_new" RENAME TO "MediaType";
DROP TYPE "public"."MediaType_old";
COMMIT;
