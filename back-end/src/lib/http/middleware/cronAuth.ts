import type { Context, Next } from "hono";
import env from "@/env";
import crypto from "node:crypto";

export async function cronAuth(c: Context, next: Next) {
  const authHeader = c.req.header("x-auth");

  if (!authHeader) {
    return c.json({ error: "Unauthorized", message: "Missing x-auth header", code: "UNAUTHORIZED" }, 401);
  }

  const expected = Buffer.from(env.CRON_SECRET);
  const received = Buffer.from(authHeader);

  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
    return c.json({ error: "Unauthorized", message: "Invalid x-auth header", code: "UNAUTHORIZED" }, 401);
  }

  return next();
}
