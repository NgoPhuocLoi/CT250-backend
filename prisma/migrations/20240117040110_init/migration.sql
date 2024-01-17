/*
  Warnings:

  - You are about to drop the `account_information` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `birthday` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "account_information" DROP CONSTRAINT "account_information_account_id_fkey";

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "gender" BOOLEAN NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- DropTable
DROP TABLE "account_information";
