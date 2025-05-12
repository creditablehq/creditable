-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_brokerId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "brokerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "Broker"("id") ON DELETE SET NULL ON UPDATE CASCADE;
