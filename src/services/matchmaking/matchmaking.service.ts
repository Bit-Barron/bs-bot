import { CommandInteraction } from "discord.js";
import {
  createMatchmaking,
  cancelMatchmaking,
  getMatchmakingByDiscordId,
} from "./matchmaking.repository";
import { ResultType } from "../../types/global";
import { MatchmakingShuffleService } from "../team-shuffle.service";
import prisma from "../../utils/prisma";

export class MatchmakingService {
  private readonly matchmakingQueue: string[] = [];
  private readonly REQUIRED_PLAYERS = 6;
  private readonly shuffleService: MatchmakingShuffleService;

  constructor() {
    this.shuffleService = new MatchmakingShuffleService();
  }

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
      const playersInQueue = this.matchmakingQueue.splice(
        0,
        this.REQUIRED_PLAYERS,
      );
      const shuffledPlayers = this.shuffleService.shuffle(playersInQueue);

      const team1 = shuffledPlayers.slice(0, 3);
      const team2 = shuffledPlayers.slice(3, 6);

      const match = await prisma.match.create({
        data: {
          team1: team1.join(","),
          team2: team2.join(","),
          status: "PENDING",
        },
      });

      await Promise.all([
        createMatchmaking(team1.join(","), "team1"),
        createMatchmaking(team2.join(","), "team2"),
      ]);

      return {
        success: true,
        message: "Teams created successfully and match has been recorded.",
      };
    } catch (error) {
      console.error("Error creating teams:", error);
      return {
        success: false,
        message: "Failed to create teams and record match.",
      };
    }
  }
}
