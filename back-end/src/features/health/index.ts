import { createRouter } from "@/lib/http/createApi";
import { healthRoute } from "./http/health.route";
import { healthHandler } from "./http/health.handler";

export const healthRouter = createRouter().openapi(healthRoute, healthHandler);
