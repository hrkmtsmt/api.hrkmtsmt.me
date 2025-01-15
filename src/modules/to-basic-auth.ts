export const toBasicAuth = (username: string, password: string) => {
  return `Basic ${btoa(`${username}:${password}`)}` as const;
};
