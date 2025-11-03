import configureOpenAPI from "@/http/openapi";
import createApi from "@/http/createApi";
import index from "@/routes/index";
import { healthRouter as health } from "./health/http";
import { authRouter as auth } from "./auth/http";
import { userRouter as users } from "./users/http";
import { cors } from "hono/cors";
import env from "./env";
import { authMiddleware } from "./http/middleware/auth";

const app = createApi();

configureOpenAPI(app);

const routes = [index, auth, users, health] as const;

app.use(
  "*",
  cors({
    origin: env.AUTH_URL,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.use("*", async (c, next) => {
  const path = c.req.path;

  if (
    path === "/" ||
    path === "/scalar" ||
    path === "/doc" ||
    path.startsWith("/auth") ||
    path.startsWith("/health")
  ) {
    return next();
  }

  return authMiddleware(c, next);
});

app.route("/", index);
app.route("/auth", auth);
app.route("/", users);

export type AppType = (typeof routes)[number];

export default app;
