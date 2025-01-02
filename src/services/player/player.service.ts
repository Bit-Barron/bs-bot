// services/player.service.ts
import { ResultType } from "../../types/global";
import brawlStarsApi from "../../utils/brawlstars-api";
import prisma from "../../utils/prisma";
import { deletePlayer, deleteQueue } from "./player.repository";

export class PlayerService {
  public async checkPlayerExists(
    brawlStarsId: string,
    discordId: string,
  ): Promise<ResultType | undefined> {
    try {
      await brawlStarsApi.getPlayer(brawlStarsId);

      const existingPlayer = await prisma.player.findFirst({
        where: { brawlStarsId },
      });

      if (existingPlayer) {
        return {
          success: false,
          message: "Player already saved.",
        };
      }

      await prisma.player.findFirst({
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
        data: { brawlStarsId, discordId },
      });

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

  public async removePlayer(discordId: string): Promise<ResultType> {
    try {
      deletePlayer(discordId);
      deleteQueue(discordId);

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}
