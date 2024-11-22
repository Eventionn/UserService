/*
  Warnings:

  - The `phone` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "phone",
ADD COLUMN     "phone" INTEGER,
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);
