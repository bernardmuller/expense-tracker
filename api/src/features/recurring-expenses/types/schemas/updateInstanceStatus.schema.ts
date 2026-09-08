import z from "zod";

const expenseDataSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(255, "Description must be 255 characters or less"),
  amount: z.number().positive("Amount must be greater than 0"),
  categoryId: z.string().uuid("Invalid category ID"),
  note: z.string().max(255, "Note must be 255 characters or less").optional(),
  createdAt: z.string().optional(),
});

export const updateInstanceStatusSchema = z.discriminatedUnion("isPaid", [
  z.object({
    isPaid: z.literal(true),
    expenseData: expenseDataSchema,
  }),
  z.object({
    isPaid: z.literal(false),
  }),
]);

export type UpdateInstanceStatusParams = z.infer<
  typeof updateInstanceStatusSchema
>;
export type MarkInstancePaidExpenseData = z.infer<typeof expenseDataSchema>;
