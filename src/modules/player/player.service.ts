import prisma from "../../utils/prisma";
import { MatchmakingQueueService } from "../queue/queue.service";
import { createPlayer, deletePlayer, deleteQueue } from "./player.repository";

interface PlayerOperationResult {
  success: boolean;
  message?: string;
}

export class PlayerService {
  public async checkPlayerExists(
    brawlStarsId: string,
    discordId: string,
  ): Promise<PlayerOperationResult> {
    const formattedId = encodeURIComponent(`#${brawlStarsId}`);
    const url = `https://api.brawlstars.com/v1/players/${formattedId}`;

    try {
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

      createPlayer(brawlStarsId, discordId);

      return {
        success: true,
        message: "Player successfully saved and added to the queue.",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to check user existence.",
      };
    }
  }

  public async removePlayer(discordId: string): Promise<PlayerOperationResult> {
    try {
      deletePlayer(discordId);
      deleteQueue(discordId);

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}
