import prisma from "../../utils/prisma";

export const createMatchmaking = async (
  teamCode: string,
  discordId: string,
) => {
  return await prisma.matchmaking.create({
    data: {
      teamCode,
      discordId,
    },
  });
};

export const cancelMatchmaking = async (discordId: string) => {
  return await prisma.matchmaking.update({
    where: { discordId },
    data: { status: "CANCELLED" },
  });
};

export const getMatchmakingByDiscordId = async (discordId: string) => {
  return await prisma.matchmaking.findUnique({
    where: { discordId },
  });
};


