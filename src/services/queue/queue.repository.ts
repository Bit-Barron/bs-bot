import prisma from "../../utils/prisma";

export const createQueue = async (discordId: string, brawlStarsId: string) => {
  await prisma.queue.create({
    data: {
      discordId,
      brawlstarsId: brawlStarsId,
    },
  });
};

export const getQueue = async () => {
  return await prisma.queue.findMany();
};

export const findPlayer = async (brawlStarsId: string) => {
  return await prisma.player.findFirst({
    where: {
      brawlstarsId: brawlStarsId,
    },
  });
};

export const findQueue = async (discordId: string) => {
  return await prisma.queue.findFirst({
    where: {
      discordId,
    },
  });
};
