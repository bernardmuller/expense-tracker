import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { recurringExpenseTemplateSchema } from "../types";

const tags = ["Recurring Expenses"];

export const listTemplatesRoute = createRoute({
  path: "/users/{userId}/recurring-expenses",
  method: "get",
  tags,
  request: {
    params: z.object({ userId: z.uuid() }),
    query: z.object({
      includeDeleted: z
        .union([z.literal("true"), z.literal("false")])
        .optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ templates: z.array(recurringExpenseTemplateSchema) }),
      "List of recurring expense templates",
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorResponseSchema,
      "Forbidden — userId does not match authenticated user",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
