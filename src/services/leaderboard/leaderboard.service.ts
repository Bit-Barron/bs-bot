import { ResultType } from "../../types/global";

export class LeaderboardService {
  public async leaderboard(
    discordId: string,
    brawlStarsId: string,
  ): Promise<ResultType> {
    try {
      return {
        success: true,
        message: "User ranking successfully retrieved.",
      };
    } catch (err) {
      return {
        success: false,
        message: "Failed to get user ranking.",
      };
    }
  }
}
