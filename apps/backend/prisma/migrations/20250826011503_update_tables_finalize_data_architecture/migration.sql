/*
  Warnings:

  - You are about to drop the column `tier1CostSharing` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `tier2CostSharing` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `tier3CostSharing` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `tier4CostSharing` on the `Plan` table. All the data in the column will be lost.
  - Added the required column `plans` to the `Broker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `t1CostSharingType` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `t2CostSharingType` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `t3CostSharingType` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `t4CostSharingType` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Made the column `brokerId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CostShareType" AS ENUM ('COPAY', 'COINSURANCE');

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_brokerId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_brokerId_fkey";

-- AlterTable
ALTER TABLE "Broker" ADD COLUMN     "plans" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "brokerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "actuarialAssumptions" JSONB,
ADD COLUMN     "actuarialValue" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "tier1CostSharing",
DROP COLUMN "tier2CostSharing",
DROP COLUMN "tier3CostSharing",
DROP COLUMN "tier4CostSharing",
ADD COLUMN     "t1CostSharingType" "CostShareType" NOT NULL,
ADD COLUMN     "t2CostSharingType" "CostShareType" NOT NULL,
ADD COLUMN     "t3CostSharingType" "CostShareType" NOT NULL,
ADD COLUMN     "t4CostSharingType" "CostShareType" NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "brokerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "Broker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "Broker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
