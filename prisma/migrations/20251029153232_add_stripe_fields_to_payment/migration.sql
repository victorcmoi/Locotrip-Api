/*
  Warnings:

  - You are about to drop the column `stripe_id` on the `payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripe_payment_intent_id]` on the table `payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentStatus" ADD VALUE 'processing';
ALTER TYPE "PaymentStatus" ADD VALUE 'failed';
ALTER TYPE "PaymentStatus" ADD VALUE 'partially_refunded';
ALTER TYPE "PaymentStatus" ADD VALUE 'cancelled';

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "stripe_id",
ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currency" VARCHAR(3) NOT NULL DEFAULT 'eur',
ADD COLUMN     "failure_reason" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "refunded_amount" DECIMAL(10,2),
ADD COLUMN     "refunded_at" TIMESTAMP(6),
ADD COLUMN     "stripe_charge_id" VARCHAR(255),
ADD COLUMN     "stripe_customer_id" VARCHAR(255),
ADD COLUMN     "stripe_payment_intent_id" VARCHAR(255),
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "payment_stripe_payment_intent_id_key" ON "payment"("stripe_payment_intent_id");

-- CreateIndex
CREATE INDEX "payment_stripe_payment_intent_id_idx" ON "payment"("stripe_payment_intent_id");

-- CreateIndex
CREATE INDEX "payment_stripe_customer_id_idx" ON "payment"("stripe_customer_id");

-- CreateIndex
CREATE INDEX "payment_status_idx" ON "payment"("status");
