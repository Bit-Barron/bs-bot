import { Discord, Slash } from "discordx";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import { PlayerService } from "../../modules/player/player.service";

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
      const errorEmbed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription(`An unexpected error occurred: ${error}`)
        .setColor("Red");

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
}
