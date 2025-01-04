import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { LeaderboardService } from "../../services/leaderboard/leaderboard.service";

@Discord()
export class LeaderboardCommand {
  private leaderboardService = new LeaderboardService();

  constructor() {
    this.leaderboardService = new LeaderboardService();
  }

  @Slash({
    name: "leaderboard",
    description: "Get the leaderboard",
  })
  async leaderboard(interaction: CommandInteraction): Promise<void> {
    try {
      await interaction.deferReply();
    } catch (err) {}
  }
}
