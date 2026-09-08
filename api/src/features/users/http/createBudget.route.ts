import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { createBudgetSchema } from "../types/types";

const tags = ["Users"];

export const createBudgetRoute = createRoute({
  path: "/users/{id}/budgets",
  method: "post",
  tags,
  request: {
    params: z.object({
      id: z.uuid(),
    }),
    body: jsonContent(createBudgetSchema, "Budget creation data"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        id: z.string().uuid(),
        userId: z.string().uuid(),
        name: z.string(),
        startAmount: z.string(),
        currentAmount: z.string(),
        isActive: z.boolean(),
        createdAt: z.string(),
        updatedAt: z.string(),
        deletedAt: z.string().nullable(),
      }),
      "Budget created successfully",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "User not found",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
