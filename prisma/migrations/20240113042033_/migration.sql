-- CreateTable
CREATE TABLE "account_information" (
    "account_id" INTEGER NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" BOOLEAN NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_information_pkey" PRIMARY KEY ("account_id")
);

-- AddForeignKey
ALTER TABLE "account_information" ADD CONSTRAINT "account_information_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;
