import { Discord, Slash } from "discordx";
import prisma from "../../utils/prisma";
import { MatchType } from "../../types/matchmaking/match.types";
import { CommandInteraction } from "discord.js";
import { createEmbed } from "../../helpers/discord.helper";

@Discord()
export class MatchesCommand {
  @Slash({
    name: "matches",
    description: "Get all matches",
  })
  async matches(interaction: CommandInteraction): Promise<MatchType[]> {
    const getMatches = await prisma.match.findMany();

    const matches = getMatches.map((match) => ({
      ...match,
      status: match.status as MatchType["status"],
    }));

    await interaction.editReply({
      embeds: [
        createEmbed(
          "Matches",
          matches
            .map(
              (match) =>
                `ID: ${match.id}, Team 1: ${match.team1}, Team 2: ${match.team2}, Status: ${match.status}, Created At: ${match.createdAt}`,
            )
            .join("\n"),
          "Green",
        ),
      ],
    });

    return matches;
  }
}
