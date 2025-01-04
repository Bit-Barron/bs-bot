/*
  Warnings:

  - The `team1` column on the `Match` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `team2` column on the `Match` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "team1",
ADD COLUMN     "team1" TEXT[],
DROP COLUMN "team2",
ADD COLUMN     "team2" TEXT[];
