import { Discord, Slash, SlashOption } from "discordx";
import {
  CommandInteraction,
  ApplicationCommandOptionType,
  EmbedBuilder,
} from "discord.js";
import { PlayerService } from "../../services/player/player.service";
import { QueueService } from "../../services/queue/queue.service";
import { createEmbed } from "../../helpers/discord.helper";

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

      await interaction.editReply({
        embeds: [
          createEmbed(
            result?.success ? "Success" : "Error",
            result?.message as string,
            result?.success ? "Green" : "Red",
          ),
        ],
      });
    } catch (error) {
      await interaction.editReply({
        embeds: [
          createEmbed(
            "Error",
            `An error occurred while saving your Brawl Stars ID: ${error}`,
            "Red",
          ),
        ],
      });
    }
  }
}
