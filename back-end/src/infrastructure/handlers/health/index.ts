import type { AppRouteHandler } from "@/infrastructure/http/types";
import type { HealthRoute } from "@/infrastructure/routes/health";

export const health: AppRouteHandler<HealthRoute> = async (c) => {
  return c.json("OK");
};
