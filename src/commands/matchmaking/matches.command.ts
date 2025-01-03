import { Discord, Slash } from "discordx";
import prisma from "../../utils/prisma";
import { MatchType } from "../../types/matchmaking/match.types";

@Discord()
export class MatchesCommand {
  @Slash({
    name: "matches",
    description: "Get all matches",
  })
  async matches(): Promise<MatchType[]> {
    const getMatches = await prisma.match.findMany();

    return getMatches.map((match) => ({
      ...match,
      status: match.status as MatchType["status"],
    }));
  }
}
