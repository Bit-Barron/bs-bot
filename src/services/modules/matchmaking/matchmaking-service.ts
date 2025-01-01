import { CommandInteraction, EmbedBuilder } from "discord.js";
import prisma from "../../../utils/prisma";

export class MatchmakingService {

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
