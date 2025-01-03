import prisma from "../../utils/prisma";

export const createQueue = async (discordId: string, brawlStarsId: string) => {
  await prisma.player.create({
    data: {
      discordId,
      brawlStarsId: brawlStarsId,
    },
  });
};

export const getQueue = async () => {
  return await prisma.player.findMany();
};

export const findPlayer = async (brawlStarsId: string) => {
  return await prisma.player.findFirst({
    where: {
      brawlStarsId: brawlStarsId,
    },
  });
};

export const findQueue = async (discordId: string) => {
  return await prisma.player.findFirst({
    where: {
      discordId,
    },
  });
};
