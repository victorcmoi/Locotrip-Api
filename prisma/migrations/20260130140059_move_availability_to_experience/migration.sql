/*
  Warnings:

  - You are about to drop the `guide_availability` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "guide_availability" DROP CONSTRAINT "guide_availability_guide_fkey";

-- DropTable
DROP TABLE "guide_availability";

-- CreateTable
CREATE TABLE "experience_availability" (
    "id" UUID NOT NULL,
    "experience_id" UUID NOT NULL,
    "start_date" TIMESTAMP(6) NOT NULL,
    "end_date" TIMESTAMP(6) NOT NULL,
    "status" "AvailabilityStatus" NOT NULL,

    CONSTRAINT "experience_availability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "experience_availability_experience_id_idx" ON "experience_availability"("experience_id");

-- AddForeignKey
ALTER TABLE "experience_availability" ADD CONSTRAINT "experience_availability_experience_fkey" FOREIGN KEY ("experience_id") REFERENCES "experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
