import { ok, type Result } from "neverthrow";
import { generateUuid } from "@/lib/utils/generateUuid";
import type {
  BudgetRecurringExpense,
  RecurringExpenseTemplate,
} from "../types";

/**
 * Snapshot a template into a budget instance.
 *
 * Copies description / amount / categoryId at creation time so subsequent
 * template edits do not mutate this instance.
 */
export const createInstanceFromTemplate = (
  budgetId: string,
  template: RecurringExpenseTemplate,
): Result<BudgetRecurringExpense, never> => {
  const now = new Date();
  return ok({
    id: generateUuid(),
    budgetId,
    description: template.description,
    amount: template.amount,
    categoryId: template.categoryId,
    isPaid: false,
    expenseId: null,
    templateId: template.id,
    scheduledAt: template.scheduledAt,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  });
};
