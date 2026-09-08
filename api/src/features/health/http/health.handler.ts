import type { Context } from "hono";

export const healthHandler = async (c: Context) => {
  return c.json("OK", 200);
};
