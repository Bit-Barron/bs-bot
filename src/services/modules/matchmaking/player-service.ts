import prisma from "../../../utils/prisma";
import { QueueService } from "./queue-service";

interface PlayerExistenProps {
  success: boolean;
  message: string;
}

export class PlayerService {
  private readonly BASE_URL = "https://api.brawlstars.com/v1/players/";
  private queueService: QueueService;

  constructor() {
    this.queueService = new QueueService();
  }

  public async checkPlayerExists(
    brawlStarsId: string,
    discordId: string,
  ): Promise<{ success: boolean; message: string }> {
    const formattedId = encodeURIComponent(`#${brawlStarsId}`);
    const url = `${this.BASE_URL}${formattedId}`;

    try {
      // Check if player exists
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.BRAWL_STARS_API_KEY}`,
        },
      });

      if (response.status === 404) {
        return {
          success: false,
          message: "Player not found. Please check your Brawl Stars ID.",
        };
      }

      // Check if player is already saved
      const existingPlayer = await prisma.player.findFirst({
        where: { brawlstarsId: brawlStarsId },
      });

      if (existingPlayer) {
        return {
          success: false,
          message: "Player already saved",
        };
      }

      // Check if player is already in the queue
      const playerAlreadyInQueue = await prisma.player.findFirst({
        where: { discordId },
      });

      if (playerAlreadyInQueue) {
        return {
          success: false,
          message:
            "You have already saved a Brawl Stars ID. Only one ID is allowed per Discord account.",
        };
      }

      await prisma.player.create({
        data: {
          brawlstarsId: brawlStarsId,
          discordId,
        },
      });

      return {
        success: true,
        message: "Player successfully saved and added to the queue.",
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to check user existence: ${error}`,
      };
    }
  }

  public async removePlayer(discordId: string): Promise<{ success: boolean }> {
    try {
      await prisma.player.deleteMany({ where: { discordId } });
      await prisma.queue.deleteMany({ where: { discordId } });

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}
