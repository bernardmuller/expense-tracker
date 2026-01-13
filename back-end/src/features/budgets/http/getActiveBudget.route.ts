import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";

const tags = ["Budgets"];

export const getActiveBudgetRoute = createRoute({
  path: "/users/{id}/budgets/active",
  method: "get",
  tags: tags,
  request: {
    params: z.object({ id: z.uuid() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        id: z.uuid(),
        userId: z.uuid(),
        name: z.string(),
        startAmount: z.string(),
        currentAmount: z.string(),
        isActive: z.boolean(),
        createdAt: z.date(),
        updatedAt: z.date(),
        deletedAt: z.date().nullable(),
        startDate: z.date().nullable(),
        endDate: z.date().nullable(),
        expenses: z.array(
          z.object({
            id: z.uuid(),
            budgetId: z.uuid(),
            description: z.string(),
            amount: z.string(),
            categoryId: z.uuid(),
            createdAt: z.date(),
            updatedAt: z.date(),
            deletedAt: z.date().nullable(),
            category: z.object({
              id: z.uuid(),
              key: z.string(),
              label: z.string(),
              icon: z.string(),
            }),
          }),
        ),
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
