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
    const embed = createEmbed("Matches", "Here are the matches", "Green");
    await interaction.editReply({ embeds: [embed] });
  }
}
