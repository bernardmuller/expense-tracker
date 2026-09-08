import type { z } from "zod";
import type {
  timeseriesPathParamsSchema,
  timeseriesQueryParamsSchema,
} from "../schemas/timeseriesParams.schema";

export type TimeseriesPathParams = z.infer<typeof timeseriesPathParamsSchema>;
export type TimeseriesQueryParams = z.infer<
  typeof timeseriesQueryParamsSchema
>;
