import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorResponseSchema } from "@/lib/errors/errorResponseSchema";
import {
  timeseriesPathParamsSchema,
  timeseriesQueryParamsSchema,
  timeseriesResponseSchema,
} from "../types";

const tags = ["Categories"];

export const getCategoryExpenseTimeseriesRoute = createRoute({
  path: "/categories/{categoryId}/expenses/timeseries",
  method: "get",
  tags,
  request: {
    params: timeseriesPathParamsSchema,
    query: timeseriesQueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      timeseriesResponseSchema,
      "Monthly expense totals for the category",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorResponseSchema,
      "Invalid categoryId or months parameter",
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
