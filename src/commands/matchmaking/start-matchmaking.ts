import { Discord, Slash, SlashOption } from "discordx";
import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { MatchmakingService } from "../../services/matchmaking/matchmaking.service";
import { createEmbed } from "../../helpers/discord.helper";

@Discord()
export class StartMatchmakingCommand {
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

      const matchmaking = await this.matchmakingService.startMatchmaking(
        team_code,
        interaction.user.id,
      );

      if (matchmaking.success) {
        await interaction.editReply({
          embeds: [
            createEmbed("Success", matchmaking.message as string, "Green"),
          ],
        });
      } else {
        await interaction.editReply({
          embeds: [createEmbed("Error", matchmaking.message as string, "Red")],
        });
      }
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
}
