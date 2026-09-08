import { z } from "zod";
import { notificationPreferenceSchema } from "./notificationPreference.schema";

export const recurringExpenseTemplateSummarySchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
  amount: z.string(),
  scheduledAt: z.string(),
  categoryId: z.string().uuid().nullable(),
});

export const notificationPreferenceWithEntitySchema =
  notificationPreferenceSchema.extend({
    template: recurringExpenseTemplateSummarySchema.nullable(),
  });
