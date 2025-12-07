import { createError } from "@/lib/utils/createError";
import z from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { expenses } from "@/lib/db/schema";

export const transactionInsertSchema = createInsertSchema(expenses);
export const transactionSchema = createSelectSchema(expenses);

export type Transaction = z.infer<typeof transactionSchema>;

export const createTransactionSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(255, "Description must be 255 characters or less"),
  amount: z.number().positive("Amount must be greater than 0"),
  categoryId: z.string().uuid("Invalid category ID"),
});

export type CreateTransactionParams = z.infer<typeof createTransactionSchema>;

export const BudgetNotFoundError = createError(
  "BudgetNotFoundError",
  (budgetId: string) => `Budget ${budgetId} not found`,
  {
    code: "BUDGET_NOT_FOUND",
    error: "Not Found",
    statusCode: 404,
  },
);

export const CategoryNotFoundError = createError(
  "CategoryNotFoundError",
  (categoryId: string) => `Category ${categoryId} not found`,
  {
    code: "CATEGORY_NOT_FOUND",
    error: "Not Found",
    statusCode: 404,
  },
);

export const InvalidTransactionAmountError = createError(
  "InvalidTransactionAmountError",
  (amount: number) => `Invalid transaction amount: ${amount}`,
  {
    code: "INVALID_TRANSACTION_AMOUNT",
    error: "Unprocessable Entity",
    statusCode: 422,
  },
);

export const BudgetAccessDeniedError = createError(
  "BudgetAccessDeniedError",
  (budgetId: string) => `Access denied to budget ${budgetId}`,
  {
    code: "BUDGET_ACCESS_DENIED",
    error: "Forbidden",
    statusCode: 403,
  },
);

export type TransactionValidationError =
  | InstanceType<typeof BudgetNotFoundError>
  | InstanceType<typeof CategoryNotFoundError>
  | InstanceType<typeof InvalidTransactionAmountError>;

export const deleteExpenseParamsSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  budgetId: z.string().uuid("Invalid budget ID"),
  expenseId: z.string().uuid("Invalid expense ID"),
});

export type DeleteExpenseParams = z.infer<typeof deleteExpenseParamsSchema>;
