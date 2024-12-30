import { EmbedBuilder } from "discord.js";
import prisma from "../utils/prisma";

export class QueueService {
  public async joinQueue(
    brawlStarsId: string,
    discordId: string,
  ): Promise<boolean> {
    if (!brawlStarsId) {
      throw new Error("Invalid input: Brawl Stars ID is required.");
    }

    const existingQueue = await prisma.queue.findFirst({
      where: {
        brawlstarsId: brawlStarsId,
      },
    });

    if (existingQueue) {
      throw new Error("Already in the queue.");
    }

    try {
      await prisma.queue.create({
        data: {
          brawlstarsId: brawlStarsId,
          discordId,
        },
      });

      return true;
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("Failed to join the queue.")
        .setColor("Red");

      return false;
    }
  }
}
