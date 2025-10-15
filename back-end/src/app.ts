import configureOpenAPI from "@/infrastructure/http/openapi";
import createApi from "@/infrastructure/http/createApi";
import index from "@/infrastructure/routes/index";
import health from "./infrastructure/routes/health";

const app = createApi();

configureOpenAPI(app);

const routes = [index, health] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = (typeof routes)[number];

export default app;
