import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import {
  categoryExpensesPathParamsSchema,
  categoryExpensesQueryParamsSchema,
} from "../types";

const tags = ["Categories"];

const expenseWithCategorySchema = z.object({
  id: z.string(),
  budgetId: z.string(),
  description: z.string(),
  amount: z.string(),
  note: z.string().nullable(),
  categoryId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  category: z.object({
    id: z.string(),
    key: z.string(),
    label: z.string(),
    icon: z.string(),
  }),
});

export const getCategoryExpensesRoute = createRoute({
  path: "/categories/{categoryId}/expenses",
  method: "get",
  tags,
  request: {
    params: categoryExpensesPathParamsSchema,
    query: categoryExpensesQueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        expenses: z.array(expenseWithCategorySchema),
        count: z.number(),
      }),
      "List of expenses for the category",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      "Invalid categoryId format or query parameters",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorResponseSchema,
      "Missing or invalid authentication",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "Category not found or does not belong to user",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
