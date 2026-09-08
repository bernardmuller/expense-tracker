import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { budgetSchema } from "../types";

const tags = ["Budgets"];

export const getBudgetsRoute = createRoute({
  path: "/budgets",
  method: "get",
  tags: tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        budgets: z.array(budgetSchema),
        count: z.number(),
      }),
      "Active budget with expenses",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "Active budget not found",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
