import { Discord, Slash } from "discordx";
import prisma from "../../utils/prisma";
import { MatchType } from "../../types/matchmaking/match.types";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import { createEmbed } from "../../helpers/discord.helper";

@Discord()
export class MatchesCommand {
  @Slash({
    name: "matches",
    description: "Get all matches",
  })
  async matches(interaction: CommandInteraction): Promise<void> {
    const getMatches = await prisma.match.findMany();

    const matches = getMatches.map((match) => ({
      ...match,
      status: match.status as MatchType["status"],
    }));

    const embeds = matches.map((match) => {
      return new EmbedBuilder()
        .setTitle(`Match ID: ${match.id}`)
        .addFields(
          { name: "Team 1", value: `${match.team1}`, inline: true },
          { name: "Team 2", value: `${match.team2}`, inline: true },
          { name: "Status", value: `${match.status}`, inline: true },
          {
            name: "Created At",
            value: `${match.createdAt.toLocaleString()}`,
            inline: true,
          },
        )
        .setColor("Green");
    });

    await interaction.editReply({ embeds });
  }
}
