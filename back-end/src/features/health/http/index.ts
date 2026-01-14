import { createRouter } from "@/lib/http/createApi";
import { healthRoute } from "./health.route";
import { healthHandler } from "./health.handler";

export const healthRouter = createRouter().openapi(healthRoute, healthHandler);

// Barrel exports
export * from "./health.route";
export * from "./health.handler";
