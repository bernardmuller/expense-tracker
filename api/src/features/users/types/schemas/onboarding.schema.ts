import z from "zod";

export const onboardingCategorySchema = z.object({
  id: z.string().uuid(),
  icon: z.string(),
  label: z.string(),
  amount: z.number().positive(),
});

export const onboardingSchema = z.object({
  name: z.string().min(1).max(50),
  startAmount: z.number().positive(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  budgetFrequency: z.enum(["weekly", "bi-weekly", "monthly", "custom"]),
  budgetStartDay: z.number(),
  customDuration: z.number().optional(),
  categories: z.array(onboardingCategorySchema).min(1),
});
