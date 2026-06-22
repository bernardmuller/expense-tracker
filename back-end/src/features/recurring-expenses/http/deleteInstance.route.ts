import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";

const tags = ["Recurring Expenses"];

export const deleteInstanceRoute = createRoute({
  path: "/budgets/{budgetId}/recurring-expenses/{instanceId}",
  method: "delete",
  tags,
  request: {
    params: z.object({ budgetId: z.uuid(), instanceId: z.uuid() }),
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Instance soft-deleted",
    },
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      "Cannot delete a paid instance",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "Budget or instance not found",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
