import prisma from "../../utils/prisma";
import { createQueue } from "./queue.repository";

export class MatchmakingQueueService {
  public async joinQueue(
    brawlStarsId: string,
    discordId: string,
  ): Promise<{ success: boolean; message?: string }> {
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
      return {
        success: false,
        message: "Player not found. Please check your Brawl Stars ID.",
      };
    }

    if (existingQueue) {
      return { success: false, message: "Already in the queue." };
    }

    try {
      createQueue(discordId, brawlStarsId);

      return { success: true };
    } catch (error) {
      return { success: false, message: "Failed to join the queue." };
    }
  }
}
