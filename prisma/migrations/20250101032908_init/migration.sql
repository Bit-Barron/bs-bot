/*
  Warnings:

  - A unique constraint covering the columns `[discordId]` on the table `Matchmaking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Matchmaking_discordId_key" ON "Matchmaking"("discordId");
