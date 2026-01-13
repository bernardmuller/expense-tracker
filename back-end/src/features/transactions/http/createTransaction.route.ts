import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import { createTransactionSchema, transactionSchema } from "../types";

const tags = ["Transactions"];

export const createTransactionRoute = createRoute({
  path: "/budgets/{id}/transactions",
  method: "post",
  tags,
  request: {
    params: z.object({ id: z.uuid() }),
    body: jsonContent(createTransactionSchema, "Transaction creation data"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      transactionSchema,
      "Transaction created successfully",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorResponseSchema,
      "Budget or category not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorResponseSchema,
      "Validation error",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorResponseSchema,
      "Internal server error",
    ),
  },
});
