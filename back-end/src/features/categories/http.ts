import { createRouter } from "@/lib/http/createApi";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import type { Context } from "hono";
import { createContext } from "@/lib/db/context";
import * as CategoryOperations from "./operations";
import { categorySchema } from "./types";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { mapErrorToResponse } from "@/lib/http/errorMapper";

const tags = ["Categories"];

// --------------------------------
// Route Definitions (OpenAPI)
// --------------------------------

const getAllCategoriesRoute = createRoute({
  path: "/categories",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(categorySchema),
      "Returns a list of categories",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});

// --------------------------------
// Handlers
// --------------------------------

const getAllCategoriesHandler = async (c: Context) => {
  const ctx = createContext();
  const result = await CategoryOperations.getAllCategories(ctx);

  return result.match(
    (categories) => c.json(categories, 200),
    (error) => mapErrorToResponse(error, c),
  );
};

// --------------------------------
// Router
// --------------------------------

export const categoryRouter = createRouter()
  .openapi(getAllCategoriesRoute, getAllCategoriesHandler);
