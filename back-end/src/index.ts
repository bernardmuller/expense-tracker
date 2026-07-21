import { serve } from "@hono/node-server";
import app from "./app";
import env from "./env";
import { bot } from "./lib/telegram";

const port = env.PORT;
// eslint-disable-next-line no-console
console.log(`Server is running on http://localhost:${port}`);

const server = serve({
  fetch: app.fetch,
  port,
});

const shutdown = () => {
  bot.stopPolling().finally(() => {
    server.close(() => process.exit(0));
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
