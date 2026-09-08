import type { z } from "zod";
import type {
  timeseriesResponseSchema,
  timeseriesDataPointSchema,
} from "../schemas/timeseriesResponse.schema";

export type TimeseriesDataPoint = z.infer<typeof timeseriesDataPointSchema>;
export type TimeseriesResponse = z.infer<typeof timeseriesResponseSchema>;
