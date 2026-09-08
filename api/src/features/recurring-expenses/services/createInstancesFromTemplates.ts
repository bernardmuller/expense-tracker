import type { AppContext } from "@/lib/db/context";
import * as RecurringRepo from "../queries";
import * as RecurringDomain from "../actions";
import type { BudgetRecurringExpense, RecurringExpenseTemplate } from "../types";
import { AppResult, success, failure } from "@/lib/result";
import { ValidationError } from "@/lib/errors/domain";

/**
 * Called inside the budget-creation transaction. Validates that every
 * templateId belongs to the user (active templates only) and snapshots them
 * into budget_recurring_expenses. Throws ValidationError on mismatch so the
 * outer transaction rolls the entire budget back.
 *
 * To avoid leaking template existence the error message is generic — the spec
 * explicitly requires not revealing which templateId failed.
 */
export const createInstancesFromTemplates = (
  budgetId: string,
  templateIds: string[],
  userId: string,
  ctx: AppContext,
): AppResult<BudgetRecurringExpense[]> => {
  if (templateIds.length === 0) {
    return success([]);
  }

  return RecurringRepo.findTemplatesByIds(templateIds, userId, ctx).andThen(
    (templates: RecurringExpenseTemplate[]) => {
      if (templates.length !== templateIds.length) {
        return failure(
          new ValidationError("Template not found or access denied"),
        );
      }

      const instances = templates.map((t) =>
        RecurringDomain.createInstanceFromTemplate(budgetId, t)._unsafeUnwrap(),
      );

      return RecurringRepo.insertInstances(instances, ctx);
    },
  );
};
