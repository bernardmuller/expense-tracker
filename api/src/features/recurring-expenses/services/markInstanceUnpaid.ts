import { ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as RecurringRepo from "../queries";
import * as BudgetDomain from "@/features/budgets/domain/budget-processing.domain";
import * as BudgetRepo from "@/features/budgets/queries";
import { AppResult, failure } from "@/lib/result";
import type { DomainError } from "@/lib/errors/domain";
import { DatabaseError, NotFoundError } from "@/lib/errors/domain";
import { AppError } from "@/lib/errors/base";
import { InstanceNotPaidError } from "../types/errors";

/**
 * Mark a recurring expense instance as unpaid.
 *
 * Atomicity: instance flip + linked expense soft-delete + budget restoration
 * all happen in a single transaction. The atomic UPDATE guards against
 * concurrent unmark calls.
 */
export const markInstanceUnpaid = (
  userId: string,
  budgetId: string,
  instanceId: string,
  ctx: AppContext,
): AppResult<{ id: string }, DomainError | InstanceNotPaidError> =>
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
        if (!instance.isPaid) {
          return failure(new InstanceNotPaidError(instanceId));
        }

        const linkedExpenseId = instance.expenseId;
        const amountToRestore = parseFloat(instance.amount);

        return ResultAsync.fromPromise(
          ctx.db.transaction(async (tx) => {
            const txCtx = { ...ctx, db: tx };

            const flipped = await RecurringRepo.markInstanceUnpaidAtomic(
              instanceId,
              txCtx,
            );
            if (flipped.isErr()) throw flipped.error;

            if (linkedExpenseId) {
              const softDeleted = await RecurringRepo.softDeleteExpense(
                linkedExpenseId,
                txCtx,
              );
              if (softDeleted.isErr()) throw softDeleted.error;
            }

            const decryptedBudget =
              await BudgetDomain.decryptBudgetAmounts(budget);
            if (!decryptedBudget.isOk()) throw decryptedBudget.error;

            const restored = await BudgetDomain.addToBudgetCurrentAmount(
              {
                ...budget,
                currentAmount: decryptedBudget.value.currentAmount,
                startAmount: decryptedBudget.value.startAmount,
              },
              amountToRestore,
            );
            if (!restored.isOk()) throw restored.error;

            const encryptedBudget =
              await BudgetDomain.encryptBudgetAmounts(restored.value);
            if (!encryptedBudget.isOk()) throw encryptedBudget.error;

            const updatedBudget = await BudgetRepo.updateBudget(
              encryptedBudget.value,
              txCtx,
            );
            if (updatedBudget.isErr()) throw updatedBudget.error;

            return { id: instanceId };
          }),
          (error) =>
            error instanceof AppError
              ? (error as DatabaseError)
              : new DatabaseError(String(error)),
        );
      },
    );
  });
