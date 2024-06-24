export const toTimestamp = (at: string) => {
  return Math.floor(new Date(at).getTime() / 1000);
};
