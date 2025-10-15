import { createRouter } from "@/infrastructure/http/createApi";
import * as handlers from "@/infrastructure/handlers/health";
import * as routes from "./health.routes";

const router = createRouter().openapi(routes.health, handlers.health);

export default router;
