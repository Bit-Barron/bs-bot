-- CreateTable
CREATE TABLE "Matchmaking" (
    "id" TEXT NOT NULL,
    "teamCode" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,

    CONSTRAINT "Matchmaking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "brawlstarsId" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);
