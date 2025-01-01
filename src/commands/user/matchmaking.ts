import { Discord, Slash, SlashOption } from "discordx";
import {
  EmbedBuilder,
  ApplicationCommandOptionType,
  CommandInteraction,
} from "discord.js";
import { MatchmakingService } from "../../services/modules/matchmaking-service";

@Discord()
export class Matchmaking {
  private matchmakingService: MatchmakingService;

  constructor() {
    this.matchmakingService = new MatchmakingService();
  }

  @Slash({
    name: "start-matchmaking",
    description: "Tritt einer Matchmaking-Queue bei",
  })
  async startMatchmaking(
    @SlashOption({
      name: "team_code",
      description: "Dein Team-Code (z.B. X6ABG99)",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    team_code: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    try {
      await interaction.deferReply();

      await this.matchmakingService.startMatchmaking(
        team_code,
        interaction?.user.id,
      );

      const embed = new EmbedBuilder()
        .setTitle("Matchmaking Started")
        .setDescription(`Matchmaking started`)
        .setColor("Green");

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      new EmbedBuilder()
        .setTitle("Error")
        .setDescription(
          `An error occurred while adding the team to the queue: ${error}`,
        )
        .setColor("Red");
    }
  }

  @Slash({
    name: "cancel-matchmaking",
    description: "Verlasse die Matchmaking-Queue",
  })
  async cancelMatchmaking(interaction: CommandInteraction): Promise<void> {
    try {
      await interaction.deferReply();

      await this.matchmakingService.cancelMatchmaking(interaction);

      const embed = new EmbedBuilder()
        .setTitle("Matchmaking Cancelled")
        .setDescription(`Matchmaking cancelled`)
        .setColor("Green");

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      new EmbedBuilder()
        .setTitle("Error")
        .setDescription(
          `An error occurred while cancelling the matchmaking: ${error}`,
        )
        .setColor("Red");
    }
  }
}
