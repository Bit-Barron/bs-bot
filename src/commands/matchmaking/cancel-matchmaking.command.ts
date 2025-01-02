import { Discord, Slash } from "discordx";
import { CommandInteraction } from "discord.js";
import { createEmbed } from "../../helpers/discord.helper";
import { MatchmakingService } from "../../services/matchmaking/matchmaking.service";

@Discord()
export class CancelMatchmakingCommand {
  private matchmakingService = new MatchmakingService();

  @Slash({
    name: "cancel-matchmaking",
    description: "Verlasse die Matchmaking-Queue",
  })
  async execute(interaction: CommandInteraction): Promise<void> {
    try {
      await interaction.deferReply();

      await this.matchmakingService.cancelMatchmaking(interaction);

      await interaction.editReply({
        embeds: [
          createEmbed(
            "Matchmaking Cancelled",
            "Matchmaking cancelled",
            "Green",
          ),
        ],
      });
    } catch (error) {
      await interaction.editReply({
        embeds: [
          createEmbed(
            "Error",
            `An error occurred while cancelling the matchmaking: ${error}`,
            "Red",
          ),
        ],
      });
    }
  }
}
