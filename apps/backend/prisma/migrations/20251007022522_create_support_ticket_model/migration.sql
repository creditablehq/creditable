-- CreateEnum
CREATE TYPE "SupportTicketType" AS ENUM ('FEATURE_REQUEST', 'BUG');

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "type" "SupportTicketType" NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
