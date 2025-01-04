import { Discord, Slash } from "discordx";
import { QueueService } from "../../services/queue/queue.service";
import { createEmbed } from "../../helpers/discord.helper";
import { getQueue } from "../../services/queue/queue.repository";

@Discord()
export class QueueCommand {
  private readonly queueService: QueueService;

  constructor() {
    this.queueService = new QueueService();
  }

  @Slash({
    name: "queue",
    description: "See the current queue",
  })
  async queueCommand(interaction: any) {
    try {
      const queue = await getQueue();

      await interaction.reply({
        embeds: [
          createEmbed(
            "Queue",
            queue.length
              ? `There are ${queue.length} players in the queue.`
              : "There are no players in the queue.",
            "Blue",
          ),
        ],
      });
    } catch (error) {
      await interaction.reply({
        content: "An error occurred while fetching the queue.",
        ephemeral: true,
      });
    }
  }
}
