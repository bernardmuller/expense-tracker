import { z } from "zod";

export const chatsQueryParamsSchema = z.object({
  userId: z.uuid().optional(),
  chatId: z.string().optional(),
  type: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(1000).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  sort: z.enum(["createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});
