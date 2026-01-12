import configureOpenAPI from "@/lib/http/openapi";
import createApi from "@/lib/http/createApi";
import index from "@/lib/http/routes/index";
import { healthRouter as health } from "./features/health/http";
import { authRouter as auth } from "./features/auth/http";
import { userRouter as users } from "./features/users/http";
import { categoryRouter as categories } from "./features/categories/http";
import { transactionRouter as transactions } from "./features/transactions/http";
import { budgetRouter as budgets } from "./features/budgets/http";
import { cors } from "hono/cors";
import env from "./env";
import { authMiddleware } from "@/lib/http/middleware/auth";

const app = createApi();

configureOpenAPI(app);

const routes = [
  index,
  auth,
  users,
  categories,
  transactions,
  health,
  budgets,
] as const;

app.use(
  "*",
  cors({
    origin: [env.AUTH_URL, "http://localhost:4173"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
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
app.route("/", budgets);
app.route("/", categories);
app.route("/", transactions);

export type AppType = typeof app;

export default app;
