import { createContext } from "@/lib/db/context";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { createRouter } from "@/lib/http/createApi";
import { mapErrorToResponse } from "@/lib/http/errorMapper";
import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import * as CategoryOperations from "./operations";
import { categoryWithoutMetadataSchema, type Category } from "./types";
import { parseSearchQuery } from "@/lib/utils/parseSearchQuery";

const tags = ["Categories"];

const getCategoriesRoute = createRoute({
  path: "/categories",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        categories: z.array(categoryWithoutMetadataSchema),
        count: z.number(),
      }),
      "List of categories",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});

const getCategoriesHandler = async (c: Context) => {
  return parseSearchQuery<
    Category,
    {
      userId: string;
      key: string;
    }
  >({
    rawQuery: c.req.query(),
    allowedSortKeys: ["key", "createdAt"],
    filterKeys: ["userId", "key"],
  })
    .asyncAndThen((search) => {
      const ctx = createContext();
      return CategoryOperations.getCategories(search, ctx);
    })
    .match(
      (categories) => c.json({ categories, count: categories.length }, 200),
      (error) => mapErrorToResponse(error, c),
    );
};

export const categoryRouter = createRouter().openapi(
  getCategoriesRoute,
  getCategoriesHandler,
);
