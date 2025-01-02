const baseUrl = "https://api.brawlstars.com/v1";
const maxRetries = 3;

const brawlStarsApi = {
  getPlayer: async (brawlStarsId: string, retries = 0): Promise<any> => {
    const formattedId = encodeURIComponent(`#${brawlStarsId}`);
    const url = `${baseUrl}/players/${formattedId}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.BRAWL_STARS_API_KEY}`,
        },
      });

      if (!response.ok) {
        if (retries < maxRetries) {
          console.warn(
            `Brawl Stars API request failed with status ${response.status}, retrying... (${
              retries + 1
            }/${maxRetries})`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, 2 ** retries * 1000),
          );
          return brawlStarsApi.getPlayer(brawlStarsId, retries + 1); // Rekursiver Aufruf
        } else {
          throw new Error(
            `Brawl Stars API request failed with status ${response.status} after ${maxRetries} retries`,
          );
        }
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching player data:", error);
      throw error;
    }
  },
};

export default brawlStarsApi;
