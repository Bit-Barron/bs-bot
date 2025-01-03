import prisma from "../utils/prisma";

interface ResultType {
  success: boolean;
  message: string;
  data?: {
    teams: any[][];
  };
}

export class MatchmakingShuffleService {
  public shuffle(array: any[]): any[] {
    const shuffledArray = [...array];
    let currentIndex = shuffledArray.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
        shuffledArray[randomIndex],
        shuffledArray[currentIndex],
      ];
    }

    return shuffledArray;
  }

  public async shuffleTeams(): Promise<ResultType> {
    try {
      const players = await prisma.player.findMany();

      if (players.length < 18) {
        return {
          success: false,
          message:
            "Not enough players to shuffle teams. At least 18 players are required.",
        };
      }

      const shuffledPlayers = this.shuffle(players);

      const teams: any[][] = [];
      const teamSize = 3;
      const maxTeams = 6;

      for (let i = 0; i < maxTeams; i++) {
        const startIndex = i * teamSize;
        const endIndex = startIndex + teamSize;
        const team = shuffledPlayers.slice(startIndex, endIndex);

        if (team.length === teamSize) {
          teams.push(team);
        }
      }

      if (teams.length !== maxTeams) {
        return {
          success: false,
          message: "Failed to create exactly 6 teams.",
        };
      }

      return {
        success: true,
        message: "Teams shuffled successfully.",
        data: { teams },
      };
    } catch (error) {
      console.error("Error in shuffleTeams:", error);
      return {
        success: false,
        message: "Failed to shuffle teams due to an internal error.",
      };
    }
  }
}
