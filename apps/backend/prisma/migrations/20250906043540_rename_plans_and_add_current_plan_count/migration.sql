/*
  Warnings:

  - You are about to alter the column `plans` on the `Broker` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - A unique constraint covering the columns `[name]` on the table `Broker` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Broker" ADD COLUMN     "currentPlanCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "plans" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Broker_name_key" ON "Broker"("name");
