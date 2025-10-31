import { pinoLogger as logger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";

import env from "@/env";

// Shared pino instance for use in both middleware and domain logic
export const pinoInstance = pino(
  {
    level: env.LOG_LEVEL || "info",
  },
  env.NODE_ENV === "production" ? undefined : pretty(),
);

export function pinoLogger() {
  return logger({
    pino: pinoInstance,
  });
}
