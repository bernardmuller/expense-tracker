import { ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as TransactionRepo from "../queries/index";
import * as BudgetDomain from "../../budgets/domain/budget-processing.domain";
import * as BudgetRepo from "../../budgets/queries/index";
import type { Transaction } from "../types";
import { AppResult } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const deleteTransactionAndUpdateBudget = (
  userId: string,
  budgetId: string,
  expenseId: string,
  ctx: AppContext,
): AppResult<Transaction> =>
  BudgetRepo.findBudgetById(budgetId, ctx).andThen((budget) =>
    TransactionRepo.getExpenseById(expenseId, ctx).andThen((expense) =>
      ResultAsync.fromPromise(
        ctx.db.transaction(async (tx) => {
          const transactionContext = { ...ctx, db: tx };

          const deletedExpenseResult = await TransactionRepo.hardDeleteExpense(
            expenseId,
            transactionContext,
          );
          if (deletedExpenseResult.isErr()) {
            throw deletedExpenseResult.error;
          }
          const deletedExpense = deletedExpenseResult.value;

          const decryptedBudgetResult =
            await BudgetDomain.decryptBudgetAmounts(budget);
          if (!decryptedBudgetResult.isOk()) {
            throw decryptedBudgetResult.error;
          }
          const decryptedBudget = decryptedBudgetResult.value;

          const updatedAmountResult =
            await BudgetDomain.addToBudgetCurrentAmount(
              {
                ...budget,
                currentAmount: decryptedBudget.currentAmount,
                startAmount: decryptedBudget.startAmount,
              },
              parseFloat(expense.amount),
            );
          if (!updatedAmountResult.isOk()) {
            throw updatedAmountResult.error;
          }
          const updatedBudget = updatedAmountResult.value;

          const encryptedBudgetResult =
            await BudgetDomain.encryptBudgetAmounts(updatedBudget);
          if (!encryptedBudgetResult.isOk()) {
            throw encryptedBudgetResult.error;
          }
          const encryptedBudget = encryptedBudgetResult.value;

          const finalBudgetResult = await BudgetRepo.updateBudget(
            encryptedBudget,
            transactionContext,
          );
          if (finalBudgetResult.isErr()) {
            throw finalBudgetResult.error;
          }

          return deletedExpense;
        }),
        (error) => new DatabaseError(String(error)),
      ),
    ),
  );
