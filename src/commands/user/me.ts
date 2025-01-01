import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Me {
  @Slash({
    name: "me",
    description: "Zeigt Informationen über dich an",
  })
  async me(interaction: CommandInteraction): Promise<void> {
    try {
      await interaction.deferReply();

      const user = interaction.user;

      console.log(user);
    } catch (error) {
      await interaction.editReply(
        "Es gab einen Fehler beim Ausführen des Befehls.",
      );
    }
  }
}
