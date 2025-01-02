import { Discord, Slash } from "discordx";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import prisma from "../../utils/prisma";
import { createEmbed } from "../../helpers/discord.helper";

@Discord()
export class MeCommand {
  @Slash({
    name: "me",
    description: "Zeigt Informationen über dich an",
  })
  async execute(interaction: CommandInteraction): Promise<void> {
    try {
      await interaction.deferReply();

      const discordId = interaction.user.id;

      const getUser = await prisma.player.findFirst({
        where: { discordId },
      });

      if (!getUser) {
        await interaction.editReply({
          embeds: [
            createEmbed(
              "Error",
              "Du hast keine Brawl Stars ID gespeichert.",
              "Red",
            ),
          ],
        });
        return;
      }

      await interaction.editReply({
        embeds: [
          createEmbed(
            "Deine Brawl Stars ID",
            `Deine Brawl Stars ID ist: \`${getUser.brawlStarsId}\``,
            "Green",
          ),
        ],
      });
    } catch (error) {
      await interaction.editReply({
        embeds: [
          createEmbed(
            "Error",
            `An error occurred while fetching your Brawl Stars ID: ${error}`,
            "Red",
          ),
        ],
      });
    }
  }
}
