import { createRouter } from "@/lib/http/createApi";
import { getCategoriesRoute } from "./http/getCategories.route";
import { getCategoriesHandler } from "./http/getCategories.handler";

export const categoryRouter = createRouter().openapi(
  getCategoriesRoute,
  getCategoriesHandler,
);
