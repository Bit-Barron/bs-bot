import { CommandInteraction } from "discord.js";
import {
  createMatchmaking,
  cancelMatchmaking,
  getMatchmakingByDiscordId,
} from "./matchmaking.repository";
import { ResultType } from "../../types/global";
import prisma from "../../utils/prisma";
import { shuffleArray } from "../../utils/constants";
import brawlStarsApi from "../../utils/brawlstars-api";
import { calculateEloChange } from "../../helpers/brawl-stars.helper";

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
      this.getPlayerBattleLog(discordId);

      return { success: true, message: "Matchmaking started!" };
    } else {
      return { success: false, message: result.message };
    }

    // return {
    //   success: true,
    //   message: `You joined the queue! ${this.REQUIRED_PLAYERS - this.matchmakingQueue.length} players left.`,
    // };
  }
  public async getPlayerBattleLog(discordId: string): Promise<ResultType> {
    try {
      const player = await prisma.player.findFirst({
        where: { discordId },
      });

      if (!player) {
        return { success: false, message: "Player not found." };
      }

      const battleLog = await brawlStarsApi.getBattleLog(player.brawlStarsId);

      console.log("battlelog", battleLog);

      return { success: true, message: battleLog };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Failed to process battlelog." };
    }
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
    if (this.matchmakingQueue.length < this.REQUIRED_PLAYERS) {
      return {
        success: false,
        message: `Not enough players. Waiting for ${
          this.REQUIRED_PLAYERS - this.matchmakingQueue.length
        } more.`,
      };
    }

    const playersForMatch = this.matchmakingQueue.splice(
      0,
      this.REQUIRED_PLAYERS,
    );

    const shuffledPlayers = shuffleArray(playersForMatch);

    const team1 = shuffledPlayers.slice(0, this.REQUIRED_PLAYERS / 2);
    const team2 = shuffledPlayers.slice(this.REQUIRED_PLAYERS / 2);

    await prisma.match.create({
      data: {
        team1: { set: team1 },
        team2: { set: team2 },
      },
    });

    return {
      success: true,
      message: `Match created with teams:\nTeam 1: ${team1.join(
        ", ",
      )}\nTeam 2: ${team2.join(", ")}`,
    };
  }
}
