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
  ): Promise<ResultType | undefined> {
    if (this.matchmakingQueue.length >= this.REQUIRED_PLAYERS) {
      return { success: false, message: "Queue is full." };
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
