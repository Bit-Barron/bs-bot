import prisma from "../../utils/prisma";

export class TeamShufflingService {
  public async shuffleTeams(): Promise<{
    team1: string[];
    team2: string[];
  } | null> {
    try {
      const players = await prisma.queue.findMany();

      if (players.length < 6) {
        console.log("Not enough players in the queue to form two teams.");
        return null;
      }

      const shuffledPlayers = this.shuffleArray(
        players.map((player) => player.discordId),
      );

      const team1 = shuffledPlayers.slice(0, 3);
      const team2 = shuffledPlayers.slice(3, 6);

      return { team1, team2 };
    } catch (error) {
      console.error("Error shuffling teams:", error);
      return null;
    }
  }

  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
