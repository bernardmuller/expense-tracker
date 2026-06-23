import configureOpenAPI from "@/lib/http/openapi";
import createApi from "@/lib/http/createApi";
import index from "@/lib/http/routes/index";
import { healthRouter as health } from "./features/health";
import { authRouter as auth } from "./features/auth";
import { userRouter as users } from "./features/users";
import { categoryRouter as categories } from "./features/categories";
import { transactionRouter as transactions } from "./features/transactions";
import { budgetRouter as budgets } from "./features/budgets";
import { recurringExpensesRouter as recurringExpenses } from "./features/recurring-expenses";
import { verificationRouter as verifications } from "./features/verifications";
import { chatRouter as chats } from "./features/chats";
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
  recurringExpenses,
  verifications,
  chats,
] as const;

app.use(
  "*",
  cors({
    origin: [env.AUTH_URL, "http://localhost:4173", "http://10.233.1.2:3000", "http://10.233.1.1", "http://100.96.157.69:3000"],
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
app.route("/", recurringExpenses);
app.route("/", verifications);
app.route("/", chats);

export type AppType = typeof app;

export default app;
