import z from "zod";
import { onboardingCategorySchema } from "./onboarding.schema";

export const createBudgetSchema = z.object({
  name: z.string().min(1).max(50),
  startAmount: z.number().positive(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  categories: z.array(onboardingCategorySchema).min(1),
});
