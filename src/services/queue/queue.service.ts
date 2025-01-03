import { ResultType } from "../../types/global";
import {
  createQueue,
  findPlayer,
  findQueue,
  getQueue,
} from "./queue.repository";

export class QueueService {
  public async joinQueue(
    brawlStarsId: string,
    discordId: string,
  ): Promise<ResultType> {
    const existingQueue = await findQueue(discordId);

    const existingPlayer = await findPlayer(brawlStarsId);

    if (!existingPlayer) {
      return {
        success: false,
        message: "Player not found. Please check your Brawl Stars ID.",
      };
    }

    if (existingQueue) {
      return { success: false, message: "Already in the queue." };
    }

    try {
      createQueue(discordId, brawlStarsId);

      return { success: true };
    } catch (error) {
      return { success: false, message: "Failed to join the queue." };
    }
  }

  public async getQueue(): Promise<string> {
    const queue = await getQueue();

    if (queue.length === 0) {
      return "";
    }

    const queueList = queue.map((player) => player.brawlStarsId);

    return queueList.join("\n");
  }
}
