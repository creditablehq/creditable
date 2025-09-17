/*
  Warnings:

  - You are about to drop the column `monthlyPremiumRx` on the `Plan` table. All the data in the column will be lost.
  - You are about to alter the column `deductible` on the `Plan` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `moop` on the `Plan` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "monthlyPremiumRx",
ALTER COLUMN "deductible" SET DATA TYPE INTEGER,
ALTER COLUMN "moop" SET DATA TYPE INTEGER;
