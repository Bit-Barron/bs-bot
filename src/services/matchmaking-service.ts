import { CommandInteraction, EmbedBuilder } from "discord.js";
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

    await prisma.matchmaking.create({
      data: {
        teamCode,
        discordId,
      },
    });
  }

  public async cancelMatchmaking(
    interaction: CommandInteraction,
  ): Promise<void> {
    const discordId = interaction.user.id;

    await prisma.matchmaking.deleteMany({
      where: {
        discordId,
      },
    });
  }
}
