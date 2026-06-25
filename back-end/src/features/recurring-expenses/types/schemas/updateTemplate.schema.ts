import z from "zod";

export const updateTemplateSchema = z
  .object({
    description: z
      .string()
      .min(1, "Description is required")
      .max(255, "Description must be 255 characters or less")
      .optional(),
    amount: z.number().positive("Amount must be greater than 0").optional(),
    categoryId: z.string().uuid("Invalid category ID").optional(),
    scheduledAt: z.string().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: "At least one field must be provided",
  });
