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

  constructor() {
    this.syncQueueWithDatabase();
  }

  private async syncQueueWithDatabase() {
    const records = await prisma.matchmaking.findMany();
    this.matchmakingQueue.push(...records.map((record) => record.discordId));
  }

  public async startMatchmaking(
    brawlStarsTeamCode: string,
    discordId: string,
  ): Promise<ResultType> {
    const getMatchmaking = await getMatchmakingByDiscordId(discordId);
    if (getMatchmaking) {
      return { success: false, message: "You already started a matchmaking." };
    }

    this.matchmakingQueue.push(discordId);
    await createMatchmaking(brawlStarsTeamCode, discordId);

    const result = await this.createTeamsFromQueue();

    if (result.success) {
      return { success: true, message: "Matchmaking started!" };
    } else {
      return { success: false, message: result.message };
    }

    // return {
    //   success: true,
    //   message: `You joined the queue! ${this.REQUIRED_PLAYERS - this.matchmakingQueue.length} players left.`,
    // };
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
      const players = prisma.player.findMany();

      console.log(players);

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
