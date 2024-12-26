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
    interaction: CommandInteraction
  ): Promise<void> {
    try {
      await interaction.deferReply();

      const playerExists = await this.playerService.checkPlayerExists(
        brawlStarsId,
        interaction.user.id
      );

      if (playerExists) {
        const successEmbed = new EmbedBuilder()
          .setTitle("Brawl Stars ID")
          .setDescription(
            `Your Brawl Stars ID \`${brawlStarsId}\` has been saved.`
          )
          .setColor("Green");

        await interaction.editReply({ embeds: [successEmbed] });
      } else {
        const notFoundEmbed = new EmbedBuilder()
          .setTitle("Player Not Found")
          .setDescription(
            `The Brawl Stars ID \`${brawlStarsId}\` does not exist.`
          )
          .setColor("Red");

        await interaction.editReply({ embeds: [notFoundEmbed] });
      }
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription(
          `An error occurred while checking the Brawl Stars ID: ${error}`
        )
        .setColor("Red");

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
}
