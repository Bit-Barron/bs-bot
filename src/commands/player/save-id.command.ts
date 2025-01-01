import { Discord, Slash, SlashOption } from "discordx";
import {
  CommandInteraction,
  ApplicationCommandOptionType,
  EmbedBuilder,
} from "discord.js";
import { PlayerService } from "../../modules/player/player.service";
import { QueueService } from "../../modules/queue/queue.service";

@Discord()
export class SaveIdCommand {
  private playerService = new PlayerService();
  private queueService = new QueueService();

  @Slash({
    name: "save-id",
    description: "Save your Brawl Stars ID",
  })
  async execute(
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

      await this.queueService.joinQueue(brawlStarsId, interaction.user.id);

      const embed = new EmbedBuilder()
        .setTitle(result.success ? "Success" : "Error")
        .setDescription(result.message as string)
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
