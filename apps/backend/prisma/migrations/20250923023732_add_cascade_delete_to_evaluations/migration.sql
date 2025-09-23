-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_planId_fkey";

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
