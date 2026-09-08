import { ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as RecurringRepo from "../queries";
import * as TransactionRepo from "@/features/transactions/queries";
import * as TransactionDomain from "@/features/transactions/actions";
import * as BudgetDomain from "@/features/budgets/domain/budget-processing.domain";
import * as BudgetRepo from "@/features/budgets/queries";
import type { Transaction } from "@/features/transactions/types";
import type { MarkInstancePaidExpenseData } from "../types/schemas/updateInstanceStatus.schema";
import { AppResult, failure } from "@/lib/result";
import type { DomainError } from "@/lib/errors/domain";
import { DatabaseError, NotFoundError } from "@/lib/errors/domain";
import { AppError } from "@/lib/errors/base";
import { InstanceAlreadyPaidError } from "../types/errors";

/**
 * Mark a recurring expense instance as paid.
 *
 * Atomicity: expense insert + budget deduction + instance flip happen in a
 * single transaction. The instance UPDATE uses a WHERE isPaid=false guard so
 * concurrent mark-paid calls cannot double-charge the budget.
 */
export const markInstancePaid = (
  userId: string,
  budgetId: string,
  instanceId: string,
  expenseData: MarkInstancePaidExpenseData,
  ctx: AppContext,
): AppResult<Transaction, DomainError | InstanceAlreadyPaidError> =>
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
          return failure(new InstanceAlreadyPaidError(instanceId));
        }

        return TransactionRepo.findCategoryById(
          expenseData.categoryId,
          ctx,
        ).andThen(() =>
          ResultAsync.fromPromise(
            ctx.db.transaction(async (tx) => {
              const txCtx = { ...ctx, db: tx };

              const transactionBuild = TransactionDomain.createTransaction(
                budgetId,
                expenseData,
              );
              if (!transactionBuild.isOk()) {
                throw new DatabaseError("Failed to build expense");
              }
              const expense = transactionBuild.value;

              const createdExpense = await TransactionRepo.create(
                expense,
                txCtx,
              );
              if (createdExpense.isErr()) throw createdExpense.error;

              const updatedInstance =
                await RecurringRepo.markInstancePaidAtomic(
                  instanceId,
                  expense.id,
                  txCtx,
                );
              if (updatedInstance.isErr()) throw updatedInstance.error;

              const decryptedBudget =
                await BudgetDomain.decryptBudgetAmounts(budget);
              if (!decryptedBudget.isOk()) throw decryptedBudget.error;

              const subtracted =
                await BudgetDomain.subtractFromBudgetCurrentAmount(
                  {
                    ...budget,
                    currentAmount: decryptedBudget.value.currentAmount,
                    startAmount: decryptedBudget.value.startAmount,
                  },
                  expenseData.amount,
                );
              if (!subtracted.isOk()) throw subtracted.error;

              const encryptedBudget =
                await BudgetDomain.encryptBudgetAmounts(subtracted.value);
              if (!encryptedBudget.isOk()) throw encryptedBudget.error;

              const updatedBudget = await BudgetRepo.updateBudget(
                encryptedBudget.value,
                txCtx,
              );
              if (updatedBudget.isErr()) throw updatedBudget.error;

              return createdExpense.value;
            }),
            (error) =>
              error instanceof AppError
                ? (error as DatabaseError)
                : new DatabaseError(String(error)),
          ),
        );
      },
    );
  });
