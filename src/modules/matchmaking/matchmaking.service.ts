import { CommandInteraction, EmbedBuilder } from "discord.js";
import {
  createMatchmaking,
  cancelMatchmaking,
  getMatchmakingByDiscordId,
} from "./matchmaking.repository";

export class MatchmakingService {
  private readonly matchmakingQueue: string[] = [];
  private readonly REQUIRED_PLAYERS = 6;

  public async startMatchmaking(
    brawlStarsTeamCode: string,
    discordId: string,
  ): Promise<void> {
    if (this.matchmakingQueue.length >= this.REQUIRED_PLAYERS) {
      new EmbedBuilder()
        .setTitle("Error")
        .setDescription("Matchmaking queue is full")
        .setColor("Red");
    }
    await createMatchmaking(brawlStarsTeamCode, discordId);
  }

  public async cancelMatchmaking(
    interaction: CommandInteraction,
  ): Promise<void> {
    const discordId = interaction.user.id;

    const existingRecord = getMatchmakingByDiscordId(discordId);

    if (!existingRecord) {
      throw new Error(
        "No matchmaking record found for the provided Discord ID",
      );
    }

    cancelMatchmaking(discordId);
  }
}
