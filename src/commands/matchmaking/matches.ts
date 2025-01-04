import { Discord, Slash } from "discordx";
import prisma from "../../utils/prisma";
import { MatchType } from "../../types/matchmaking/match.types";
import { CommandInteraction, EmbedBuilder, Message } from "discord.js";
import { createEmbed } from "../../helpers";

@Discord()
export class MatchesCommand {
  @Slash({
    name: "matches",
    description: "Get all matches",
  })
  async matches(
    interaction: CommandInteraction,
  ): Promise<Message<boolean> | undefined> {
    await interaction.deferReply();

    const getMatches = await prisma.match.findMany();

    const matches = getMatches.map((match) => ({
      ...match,
      status: match.status as MatchType["status"],
    }));

    if (!matches.length) {
      const embed = createEmbed("No Matches", "No matches found", "Red");
      return await interaction.editReply({ embeds: [embed] });
    }

    const matchList = matches
      .map((match, index) => {
        const team1 = match.team1.join(", ");
        const team2 = match.team2.join(", ");
        return `**Match ${index + 1}:**\nTeam 1: ${team1}\nTeam 2: ${team2}\nStatus: ${match.status}\n`;
      })
      .join("\n");

    await interaction.editReply({
      embeds: [createEmbed("Matches", matchList, "Green")],
    });
  }
}
