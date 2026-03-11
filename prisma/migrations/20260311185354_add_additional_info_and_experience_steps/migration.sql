-- AlterTable
ALTER TABLE "experience" ADD COLUMN     "additional_info" TEXT;

-- CreateTable
CREATE TABLE "experience_step" (
    "id" UUID NOT NULL,
    "experience_id" UUID NOT NULL,
    "step_number" INTEGER NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,

    CONSTRAINT "experience_step_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "experience_step_experience_id_idx" ON "experience_step"("experience_id");

-- AddForeignKey
ALTER TABLE "experience_step" ADD CONSTRAINT "experience_step_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;
