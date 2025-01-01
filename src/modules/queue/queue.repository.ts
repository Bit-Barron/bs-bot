import prisma from "../../utils/prisma";

export const createQueue = async (discordId: string, brawlStarsId: string) => {
  await prisma.queue.create({
    data: {
      discordId,
      brawlstarsId: brawlStarsId,
    },
  });
};
