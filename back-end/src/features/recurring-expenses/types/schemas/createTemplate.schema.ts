import z from "zod";

export const createTemplateSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(255, "Description must be 255 characters or less"),
  amount: z.number().positive("Amount must be greater than 0"),
  categoryId: z.string().uuid("Invalid category ID"),
});
