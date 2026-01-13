import { createRouter } from "@/lib/http/createApi";
import { getCategoriesRoute } from "./getCategories.route";
import { getCategoriesHandler } from "./getCategories.handler";

export const categoryRouter = createRouter().openapi(
  getCategoriesRoute,
  getCategoriesHandler,
);

// Barrel exports
export * from "./getCategories.route";
export * from "./getCategories.handler";
