import z from "zod";

export const userPreferencesSchema = z.object({
  budgetStartDate: z.number().nullable(),
  frequency: z.enum(["weekly", "bi-weekly", "monthly", "custom"]).nullable(),
  customDuration: z.number().nullable(),
});
