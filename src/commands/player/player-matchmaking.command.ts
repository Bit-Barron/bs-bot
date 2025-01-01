import { Discord, Slash, SlashOption } from "discordx";
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { MatchmakingService } from "../../modules/matchmaking/matchmaking.service";
import { createEmbed } from "../../helpers/discord.helper";

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
        interaction.user.id,
      );

      await interaction.editReply({
        embeds: [
          createEmbed("Matchmaking Started", "Matchmaking started", "Green"),
        ],
      });
    } catch (error) {
      await interaction.editReply({
        embeds: [
          createEmbed(
            "Error",
            `An error occurred while adding the team to the queue: ${error}`,
            "Red",
          ),
        ],
      });
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
