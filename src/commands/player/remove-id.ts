import { Discord, Slash } from "discordx";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import { PlayerService } from "../../services/player/player.service";
import { createEmbed } from "../../helpers";

@Discord()
export class RemoveIdCommand {
  private playerService = new PlayerService();

  @Slash({
    name: "remove-id",
    description: "Remove your Brawl Stars ID",
  })
  async removeIdCommand(interaction: CommandInteraction): Promise<void> {
    try {
      await interaction.deferReply();

      await this.playerService.removePlayer(interaction.user.id);

      await interaction.editReply({
        embeds: [
          createEmbed(
            "Success",
            `Your Brawl Stars ID has been removed successfully.`,
            "Green",
          ),
        ],
      });
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
