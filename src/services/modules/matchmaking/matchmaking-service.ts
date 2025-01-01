import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import prisma from "../../../utils/prisma";
import { TeamShufflingService } from "./shuffle-team-service";

export class MatchmakingService {
  private readonly teamShufflingService: TeamShufflingService;

  constructor() {
    this.teamShufflingService = new TeamShufflingService();
  }

  private async notifyTeams(
    team1: string[],
    team2: string[],
    matchId: string,
    client: Client,
  ): Promise<void> {
    try {
      const team1Mentions = team1
        .map((discordId) => `<@${discordId}>`)
        .join(" ");
      const team2Mentions = team2
        .map((discordId) => `<@${discordId}>`)
        .join(" ");

      const embed = new EmbedBuilder()
        .setTitle("Match Found!")
        .setDescription(
          `
          **Match ID:** ${matchId}
          **Team 1:** ${team1Mentions}
          **Team 2:** ${team2Mentions}

          **Instructions:**
          1. Join the voice channel for your team.
          2. Coordinate with your team and have a great match!
        `,
        )
        .setColor("Blue");

      const channelId = "1323858467055992853";
      const channel = client.channels.cache.get(channelId) as TextChannel;
      if (channel) {
        await channel.send({ embeds: [embed] });
      } else {
        console.error("Match announcement channel not found.");
      }

      for (const playerId of [...team1, ...team2]) {
        const player = await client.users.fetch(playerId);
        if (player) {
          const teamNumber = team1.includes(playerId) ? "1" : "2";
          const teamMembers =
            teamNumber === "1"
              ? team1.filter((id) => id !== playerId)
              : team2.filter((id) => id !== playerId);
          const teamMembersMentions = teamMembers
            .map((id) => `<@${id}>`)
            .join(", ");

          const dmEmbed = new EmbedBuilder()
            .setTitle(`Match Found! (Team ${teamNumber})`)
            .setDescription(
              `
              **Match ID:** ${matchId}
              **Your Team:** ${teamMembersMentions}

              **Instructions:**
              1. Join the voice channel for your team.
              2. Coordinate with your team and have a great match!
            `,
            )
            .setColor("Blue");

          await player.send({ embeds: [dmEmbed] });
        } else {
          console.error(`Player with ID ${playerId} not found.`);
        }
      }
    } catch (error) {
      console.error("Error notifying teams:", error);
    }
  }

  public async startMatchmaking(
    teamCode: string,
    discordId: string,
    client: Client, // Add client as a parameter
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await prisma.matchmaking.create({
        data: {
          teamCode,
          discordId,
        },
      });

      const teams = await this.teamShufflingService.shuffleTeams();

      if (teams) {
        const { team1, team2 } = teams;

        const match = await prisma.match.create({
          data: {
            team1: team1.join(","),
            team2: team2.join(","),
          },
        });

        // Notify teams after successful match creation
        await this.notifyTeams(team1, team2, match.id, client);

        return { success: true };
      } else {
        return {
          success: false,
          message: "Not enough players to form teams.",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to start matchmaking.",
      };
    }
  }

  public async cancelMatchmaking(
    interaction: CommandInteraction,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const discordId = interaction.user.id;

      const existingRecord = await prisma.matchmaking.findUnique({
        where: { discordId },
      });

      if (!existingRecord) {
        return {
          success: false,
          message: "No matchmaking record found for your Discord ID.",
        };
      }

      await prisma.matchmaking.update({
        where: { discordId },
        data: { status: "CANCELLED" },
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: "Failed to cancel matchmaking.",
      };
    }
  }
}
