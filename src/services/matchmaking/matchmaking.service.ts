import { CommandInteraction } from "discord.js";
import {
  createMatchmaking,
  cancelMatchmaking,
  getMatchmakingByDiscordId,
} from "./matchmaking.repository";
import { ResultType } from "../../types/global";
import prisma from "../../utils/prisma";

export class MatchmakingService {
  private readonly matchmakingQueue: string[] = [];
  private readonly REQUIRED_PLAYERS = 6;

  public async startMatchmaking(
    brawlStarsTeamCode: string,
    discordId: string,
  ): Promise<ResultType> {
    const existingRecord = await getMatchmakingByDiscordId(discordId);
    if (existingRecord) {
      return { success: false, message: "You are already in the queue." };
    }

    this.matchmakingQueue.push(discordId);
    await createMatchmaking(brawlStarsTeamCode, discordId);

    if (this.matchmakingQueue.length >= this.REQUIRED_PLAYERS) {
      const result = await this.createTeamsFromQueue();

      console.log("result", result);
      if (result.success) {
        return { success: true, message: "Matchmaking started!" };
      } else {
        return { success: false, message: result.message };
      }
    }

    return {
      success: true,
      message: `You joined the queue! ${this.REQUIRED_PLAYERS - this.matchmakingQueue.length} players left.`,
    };
  }

  public async cancelMatchmaking(
    interaction: CommandInteraction,
  ): Promise<ResultType> {
    const discordId = interaction.user.id;

    const existingRecord = await getMatchmakingByDiscordId(discordId);
    if (!existingRecord) {
      return { success: false, message: "You are not in the queue." };
    }

    this.matchmakingQueue.splice(this.matchmakingQueue.indexOf(discordId), 1);
    await cancelMatchmaking(discordId);

    return { success: true, message: "You have been removed from the queue." };
  }

  private async createTeamsFromQueue(): Promise<ResultType> {
    try {
      const player = prisma.player.findMany();

      console.log(player);

      return {
        success: true,
        message: "Teams have been created and the match has been recorded.",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to create teams and record match.",
      };
    }
  }
}
