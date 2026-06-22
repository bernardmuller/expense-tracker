import type { AppContext } from "@/lib/db/context";
import * as RecurringRepo from "../queries";
import * as BudgetRepo from "@/features/budgets/queries";
import { AppResult, failure, success } from "@/lib/result";
import type { DomainError } from "@/lib/errors/domain";
import { NotFoundError } from "@/lib/errors/domain";
import { InstancePaidCannotDeleteError } from "../types/errors";

export const deleteUnpaidInstance = (
  userId: string,
  budgetId: string,
  instanceId: string,
  ctx: AppContext,
): AppResult<{ id: string }, DomainError | InstancePaidCannotDeleteError> =>
  BudgetRepo.findBudgetById(budgetId, ctx).andThen((budget) => {
    if (budget.userId !== userId) {
      return failure(new NotFoundError(`Budget: ${budgetId}`));
    }

    return RecurringRepo.findInstanceById(instanceId, ctx).andThen(
      (instance) => {
        if (instance.budgetId !== budgetId) {
          return failure(
            new NotFoundError(`Recurring expense instance: ${instanceId}`),
          );
        }
        if (instance.isPaid) {
          return failure(new InstancePaidCannotDeleteError(instanceId));
        }
        return RecurringRepo.softDeleteInstance(instanceId, ctx).andThen(
          (deleted) => success({ id: deleted.id }),
        );
      },
    );
  });
