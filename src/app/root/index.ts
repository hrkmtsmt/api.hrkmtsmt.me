import { AppHandler } from "@src/types";

export const handler: AppHandler = (c) => {
  return c.json({ message: 'Hello World!' });
};
