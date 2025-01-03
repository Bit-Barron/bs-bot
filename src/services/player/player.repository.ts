import prisma from "../../utils/prisma";

export const createPlayer = async (brawlStarsId: string, discordId: string) => {
  await prisma.player.create({
    data: {
      brawlStarsId: brawlStarsId,
      discordId,
    },
  });
};

export const deletePlayer = async (discordId: string) => {
  await prisma.player.deleteMany({ where: { discordId } });
};

export const deleteQueue = async (discordId: string) => {
  await prisma.player.deleteMany({ where: { discordId } });
};
