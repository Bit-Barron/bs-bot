import { CommandInteraction, EmbedBuilder } from "discord.js";
import prisma from "../../../utils/prisma";
import { TeamShufflingService } from "./shuffle-team-service";

export class MatchmakingService {
  private readonly teamShufflingService: TeamShufflingService;

  constructor() {
    this.teamShufflingService = new TeamShufflingService();
  }

  public async startMatchmaking(
    teamCode: string,
    discordId: string,
  ): Promise<void> {
    await prisma.matchmaking.create({
      data: {
        teamCode,
        discordId,
      },
    });

    const teams = await this.teamShufflingService.shuffleTeams();

    if (teams) {
      const { team1, team2 } = teams;

      const match = await prisma.match.create({
        data: {
          team1: team1.join(","),
          team2: team2.join(","),
        },
      });
    }
  }

  public async cancelMatchmaking(
    interaction: CommandInteraction,
  ): Promise<void> {
    const discordId = interaction.user.id;

    const existingRecord = await prisma.matchmaking.findUnique({
      where: { discordId },
    });

    if (!existingRecord) {
      throw new Error(
        "No matchmaking record found for the provided Discord ID",
      );
    }

    await prisma.matchmaking.update({
      where: { discordId },
      data: { status: "CANCELLED" },
    });
  }
}
