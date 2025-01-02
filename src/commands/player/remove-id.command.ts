import { Discord, Slash } from "discordx";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import { PlayerService } from "../../services/player/player.service";
import { createEmbed } from "../../helpers/discord.helper";

@Discord()
export class RemoveIdCommand {
  private playerService = new PlayerService();

  @Slash({
    name: "remove-id",
    description: "Remove your Brawl Stars ID",
  })
  async execute(interaction: CommandInteraction): Promise<void> {
    try {
      await interaction.deferReply();

      const result = await this.playerService.removePlayer(interaction.user.id);

      const embed = new EmbedBuilder()
        .setTitle(result.success ? "Success" : "Error")
        .setDescription(
          result.success
            ? "Player successfully removed."
            : "Failed to remove player.",
        )
        .setColor(result.success ? "Green" : "Red");

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await interaction.editReply({
        embeds: [
          createEmbed(
            "Error",
            `An error occurred while removing your Brawl Stars ID: ${error}`,
            "Red",
          ),
        ],
      });
    }
  }
}
