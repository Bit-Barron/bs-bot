import { CommandInteraction, EmbedBuilder } from "discord.js";
import {
  createMatchmaking,
  cancelMatchmaking,
  getMatchmakingByDiscordId,
} from "./matchmaking.repository";
import { ResultType } from "../../types/global";

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
  ): Promise<ResultType | undefined> {
    const discordId = interaction.user.id;

    const existingRecord = getMatchmakingByDiscordId(discordId);

    if (!existingRecord) {
      return { success: false, message: "Already in the queue." };
    }

    cancelMatchmaking(discordId);
  }
}
