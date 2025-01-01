import prisma from "../../utils/prisma";
import { QueueService } from "../matchmaking/matchmaking-queue-service";

interface PlayerOperationResult {
  success: boolean;
  message?: string;
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
  ): Promise<PlayerOperationResult> {
    const formattedId = encodeURIComponent(`#${brawlStarsId}`);
    const url = `${this.BASE_URL}${formattedId}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.BRAWL_STARS_API_KEY}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            message: "Player not found. Please check your Brawl Stars ID.",
          };
        }
        return {
          success: false,
          message: "Failed to fetch player data from Brawl Stars API.",
        };
      }

      const existingPlayer = await prisma.player.findFirst({
        where: { brawlstarsId: brawlStarsId },
      });

      if (existingPlayer) {
        return {
          success: false,
          message: "Player already saved.",
        };
      }

      const playerWithDiscordId = await prisma.player.findFirst({
        where: { discordId },
      });

      // if (playerWithDiscordId) {
      // return {
      //   success: false,
      //   message:
      //     "You have already saved a Brawl Stars ID. Only one ID is allowed per Discord account.",
      // };
      //  }

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
      console.error("Error checking player existence:", error);
      return {
        success: false,
        message: "Failed to check user existence.",
      };
    }
  }

  public async removePlayer(discordId: string): Promise<PlayerOperationResult> {
    try {
      await prisma.player.deleteMany({ where: { discordId } });
      await prisma.queue.deleteMany({ where: { discordId } });

      return { success: true };
    } catch (error) {
      console.error("Error removing player:", error);
      return { success: false };
    }
  }
}
