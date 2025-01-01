/*
  Warnings:

  - You are about to drop the `Matchmaking` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[brawlstarsId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discordId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discordId,brawlstarsId]` on the table `Queue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- DropTable
DROP TABLE "Matchmaking";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "team1" TEXT NOT NULL,
    "team2" TEXT NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_brawlstarsId_key" ON "Player"("brawlstarsId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_discordId_key" ON "Player"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "Queue_discordId_brawlstarsId_key" ON "Queue"("discordId", "brawlstarsId");
