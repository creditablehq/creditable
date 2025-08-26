/*
  Warnings:

  - You are about to drop the column `inputData` on the `Plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "inputData",
ADD COLUMN     "deductible" DOUBLE PRECISION,
ADD COLUMN     "integratedDeductible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "monthlyPremiumRx" DOUBLE PRECISION,
ADD COLUMN     "moop" DOUBLE PRECISION,
ADD COLUMN     "t1ShareValue" DOUBLE PRECISION,
ADD COLUMN     "t1UsesDeductible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "t2ShareValue" DOUBLE PRECISION,
ADD COLUMN     "t2UsesDeductible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "t3ShareValue" DOUBLE PRECISION,
ADD COLUMN     "t3UsesDeductible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "t4ShareValue" DOUBLE PRECISION,
ADD COLUMN     "t4UsesDeductible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tier1CostSharing" DOUBLE PRECISION,
ADD COLUMN     "tier2CostSharing" DOUBLE PRECISION,
ADD COLUMN     "tier3CostSharing" DOUBLE PRECISION,
ADD COLUMN     "tier4CostSharing" DOUBLE PRECISION;
