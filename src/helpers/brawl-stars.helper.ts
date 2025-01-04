export const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export function calculateEloChange(
  playerElo: number,
  opponentElo: number,
  result: "win" | "lose",
): number {
  const k = 32; // K-Faktor bestimmt, wie schnell Elo sich ändert
  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));

  if (result === "win") {
    return Math.round(k * (1 - expectedScore));
  } else {
    return Math.round(k * (0 - expectedScore));
  }
}
