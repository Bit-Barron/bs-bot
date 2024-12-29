import prisma from "../utils/prisma";

export class PlayerService {
  private readonly BASE_URL = "https://api.brawlstars.com/v1/players/";

  public async checkPlayerExists(
    brawlStarsId: string,
    discordId: string
  ): Promise<boolean> {
    if (!brawlStarsId) {
      throw new Error("Invalid input: Brawl Stars ID is required.");
    }

    const formattedId = encodeURIComponent(`#${brawlStarsId}`);
    const url = `${this.BASE_URL}${formattedId}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.BRAWL_STARS_API_KEY}`,
        },
      });

      if (!response.ok) {
        return false;
      }

      await prisma.$transaction([
        prisma.player.create({
          data: {
            brawlstarsId: brawlStarsId,
            discordId,
          },
        }),
        prisma.queue.create({
          data: {
            brawlstarsId: brawlStarsId,
            discordId,
          },
        }),
      ]);

      return true;
    } catch (error) {
      throw new Error("Failed to check player existence.");
    }
  }
}
