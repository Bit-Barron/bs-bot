import { Discord, Slash, SlashOption } from "discordx";
import {
  CommandInteraction,
  EmbedBuilder,
  ApplicationCommandOptionType,
} from "discord.js";
import { PlayerService } from "../../services/player-service";

@Discord()
export class SaveId {
  private playerService: PlayerService;

  constructor() {
    this.playerService = new PlayerService();
  }

  @Slash({
    name: "save-id",
    description: "Save your Brawl Stars ID",
  })
  async saveid(
    @SlashOption({
      name: "id",
      description: "Your Brawl Stars ID",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    brawlStarsId: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    try {
      await interaction.deferReply();

      const result = await this.playerService.checkPlayerExists(
        brawlStarsId,
        interaction.user.id,
      );

      const embed = new EmbedBuilder()
        .setTitle(result.success ? "Success" : "Error")
        .setDescription(result.message)
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

  @Slash({
    name: "remove-id",
    description: "Remove your Brawl Stars ID",
  })
  async removeid(interaction: CommandInteraction): Promise<void> {
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