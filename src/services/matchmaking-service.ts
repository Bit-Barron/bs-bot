import prisma from "../utils/prisma";

export class MatchmakingService {
  private readonly matchmakingQueue: string[] = [];
  private readonly REQUIRED_PLAYERS = 6;
  private readonly TEAM_SIZE = 3;

  public async startMatchmaking(
    teamCode: string,
    discordId: string
  ): Promise<void> {
    if (!teamCode || !discordId) {
      throw new Error("Invalid input");
    }

    await prisma.matchmaking.create({
      data: {
        teamCode,
        discordId,
      },
    });
  }

  public async cancelMatchmaking(): Promise<void> {}
}
