-- CreateTable
CREATE TABLE "guide_hobby" (
    "guide_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,

    CONSTRAINT "guide_hobby_pkey" PRIMARY KEY ("guide_id","category_id")
);

-- CreateIndex
CREATE INDEX "guide_hobby_guide_id_idx" ON "guide_hobby"("guide_id");

-- CreateIndex
CREATE INDEX "guide_hobby_category_id_idx" ON "guide_hobby"("category_id");

-- AddForeignKey
ALTER TABLE "guide_hobby" ADD CONSTRAINT "guide_hobby_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "guide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guide_hobby" ADD CONSTRAINT "guide_hobby_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
