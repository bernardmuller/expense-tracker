import { z } from "zod";

export const notificationPreferencesQueryParamsSchema = z.object({
  type: z.string().optional(),
  channel: z.string().optional(),
  enabled: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(1000).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  sort: z.enum(["createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});
