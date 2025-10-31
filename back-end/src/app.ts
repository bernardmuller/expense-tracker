import configureOpenAPI from "@/http/openapi";
import createApi from "@/http/createApi";
import index from "@/routes/index";
import { healthRouter as health } from "./health/http";
import { authRouter as auth } from "./auth/http";
import { userRouter as users } from "./users/http";
import { cors } from "hono/cors";
import env from "./env";

const app = createApi();

configureOpenAPI(app);

const routes = [
  index,
  auth,
  users,
  // budgets,
  // categories,
  // transactions,
  // categoryBudgets,
  // userCategories,
  health,
] as const;

app.use(
  "*", // or replace with "*" to enable cors for all routes
  cors({
    origin: env.BETTER_AUTH_URL,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.use("*", async (c, next) => {
  // add custom getSession function
  // const session = await auth.api.getSession({ headers: c.req.raw.headers });
  // if (!session) {
  //   c.set("user", null);
  //   c.set("session", null);
  //   await next();
  //   return;
  // }
  // c.set("user", session.user);
  // c.set("session", session.session);
  await next();
});

app.route("/", index);
app.route("/auth", auth);
app.route("/", users);
// app.route("/", budgets);
// app.route("/", categories);
// app.route("/", transactions);
// app.route("/", categoryBudgets);
// app.route("/", userCategories);
// app.route("/", health);

export type AppType = (typeof routes)[number];

export default app;
