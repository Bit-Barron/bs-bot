import { EmbedBuilder } from "discord.js";
import prisma from "../../utils/prisma";

export class QueueService {
  public async joinQueue(
    brawlStarsId: string,
    discordId: string,
  ): Promise<boolean> {
    const existingQueue = await prisma.queue.findFirst({
      where: {
        discordId,
      },
    });

    const existingPlayer = await prisma.player.findFirst({
      where: {
        brawlstarsId: brawlStarsId,
      },
    });

    if (!existingPlayer) {
      new EmbedBuilder()
        .setTitle("Error")
        .setDescription("Player not found. Please check your Brawl Stars ID.")
        .setColor("Red");
    }

    if (existingQueue) {
      new EmbedBuilder()
        .setTitle("Error")
        .setDescription("Already in the queue.")
        .setColor("Red");
    }

    try {
      await prisma.queue.create({
        data: {
          discordId,
          brawlstarsId: brawlStarsId,
        },
      });

      return true;
    } catch (error) {
      new EmbedBuilder()
        .setTitle("Error")
        .setDescription("Failed to join the queue.")
        .setColor("Red");

      return false;
    }
  }
}
