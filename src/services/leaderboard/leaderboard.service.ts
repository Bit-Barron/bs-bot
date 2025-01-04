import { ResultType } from "../../types/global";
import brawlStarsApi from "../../utils/brawlstars-api";

export class LeaderboardService {
  public async getUserRanking(
    discordId: string,
    brawlStarsId: string,
  ): Promise<ResultType> {
    try {
      const resp = await brawlStarsApi.getBattleLog(brawlStarsId);

      console.log("dasdasd", resp);

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
