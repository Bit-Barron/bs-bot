import { EmbedBuilder } from "discord.js";
import prisma from "../utils/prisma";

export class MatchmakingService {
  private readonly matchmakingQueue: string[] = [];
  private readonly REQUIRED_PLAYERS = 6;
  private readonly TEAM_SIZE = 3;

  public async startMatchmaking(
    teamCode: string,
    discordId: string,
  ): Promise<void> {
    if (this.matchmakingQueue.length >= this.REQUIRED_PLAYERS) {
      new EmbedBuilder()
        .setTitle("Error")
        .setDescription("Matchmaking queue is full")
        .setColor("Red");
    }

    this.matchmakingQueue.push(teamCode);
  }

  public async cancelMatchmaking(): Promise<void> {}
}
