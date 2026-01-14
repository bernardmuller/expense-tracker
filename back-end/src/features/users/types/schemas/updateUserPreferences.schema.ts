import z from "zod";

export const updateUserPreferencesSchema = z.object({
  budgetStartDate: z.number().optional(),
  frequency: z.enum(["weekly", "bi-weekly", "monthly", "custom"]).optional(),
  customDuration: z.number().optional(),
});
