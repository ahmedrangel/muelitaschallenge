export const getPercentage = (wins: number, losses: number) => {
  const winrate = wins / (wins + losses) * 100;
  const formatted = winrate % 1 === 0 ? winrate.toFixed(0) : winrate.toFixed(1);
  return formatted;
};