-- AlterTable
ALTER TABLE "quotes" ADD COLUMN     "include_dependant" BOOLEAN,
ADD COLUMN     "include_spouse" BOOLEAN,
ADD COLUMN     "plan_start_date" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "planholder_info" (
    "id" TEXT NOT NULL,
    "quote_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT,
    "state" TEXT,
    "postal_code" TEXT,
    "phone" TEXT,
    "phone_type" TEXT,
    "gender" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "nationality" TEXT,
    "height" TEXT,
    "weight" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planholder_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spouse_info" (
    "id" TEXT NOT NULL,
    "quote_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "preferred_name" TEXT,
    "country" TEXT,
    "state" TEXT,
    "postal_code" TEXT,
    "occupation" TEXT,
    "occupation_industry" TEXT,
    "gender" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "nationality" TEXT,
    "height" TEXT,
    "weight" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spouse_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dependant_info" (
    "id" TEXT NOT NULL,
    "quote_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "preferred_name" TEXT,
    "gender" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "country" TEXT,
    "nationality" TEXT,
    "height" TEXT,
    "weight" TEXT,
    "relationship_to_planholder" TEXT,
    "occupation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dependant_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "planholder_info_quote_id_key" ON "planholder_info"("quote_id");

-- CreateIndex
CREATE UNIQUE INDEX "spouse_info_quote_id_key" ON "spouse_info"("quote_id");

-- AddForeignKey
ALTER TABLE "planholder_info" ADD CONSTRAINT "planholder_info_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spouse_info" ADD CONSTRAINT "spouse_info_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dependant_info" ADD CONSTRAINT "dependant_info_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
