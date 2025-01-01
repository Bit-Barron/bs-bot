import { Discord, Slash } from "discordx";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import prisma from "../../utils/prisma";

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
        const embed = new EmbedBuilder()
          .setTitle("Fehler")
          .setDescription("Du hast noch keine Brawl Stars ID gespeichert.")
          .setColor("Red");

        await interaction.editReply({ embeds: [embed] });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle("Deine Informationen")
        .setDescription(`Brawl Stars ID: ${getUser.brawlstarsId}`)
        .setColor("Blue");

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription(`An unexpected error occurred: ${error}`)
        .setColor("Red");

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
}
