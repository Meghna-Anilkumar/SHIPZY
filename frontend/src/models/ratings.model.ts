export const getMenuItemRating = (itemId: string): number => {
  const seed = itemId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const rating = 3.8 + (seed % 13) / 10;
  return Math.min(5, Number(rating.toFixed(1)));
};
