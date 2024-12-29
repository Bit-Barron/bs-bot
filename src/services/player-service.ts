import prisma from "../utils/prisma";

export class PlayerService {
  private readonly BASE_URL = "https://api.brawlstars.com/v1/players/";

  public async checkPlayerExists(
    brawlStarsId: string,
    discordId: string
  ): Promise<boolean | undefined> {
    if (!brawlStarsId) {
      throw new Error("Invalid input: Brawl Stars ID is required.");
    }

    const formattedId = encodeURIComponent(`#${brawlStarsId}`);
    const URL = `${this.BASE_URL}${formattedId}`;

    try {
      const response = await fetch(URL, {
        headers: {
          Authorization: `Bearer ${process.env.BRAWL_STARS_API_KEY}`,
        },
      });

      if (response.ok) {
        const savePlayer = prisma.player.create({
          data: {
            brawlstarsId: brawlStarsId,
            discordId,
          },
        });

        return true;
      } else if (response.status === 404) {
        return false;
      }
    } catch (error) {
      throw new Error(`Failed to check player existence: ${error}`);
    }
  }
}
