import { ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as TransactionQueries from "../queries";
import * as BudgetDomain from "../../budgets/actions";
import * as BudgetQueries from "../../budgets/queries";
import type { Transaction } from "../types";
import {
  EntityDeleteError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";
import {
  EncryptionCipherCreationError,
  EncryptionCipherUpdateError,
  EncryptionCipherFinalError,
  EncryptionDecipherCreationError,
  EncryptionDecipherUpdateError,
  EncryptionDecipherFinalError,
} from "@/lib/utils/encryption";

export const deleteTransactionAndUpdateBudget = (
  userId: string,
  budgetId: string,
  expenseId: string,
  ctx: AppContext,
): ResultAsync<
  Transaction,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EntityDeleteError>
  | InstanceType<typeof EntityUpdateError>
  | InstanceType<typeof EncryptionCipherCreationError>
  | InstanceType<typeof EncryptionCipherUpdateError>
  | InstanceType<typeof EncryptionCipherFinalError>
  | InstanceType<typeof EncryptionDecipherCreationError>
  | InstanceType<typeof EncryptionDecipherUpdateError>
  | InstanceType<typeof EncryptionDecipherFinalError>
> =>
  BudgetQueries.findBudgetById(budgetId, ctx).andThen((budget) =>
    TransactionQueries.getExpenseById(expenseId, ctx).andThen((expense) =>
      ResultAsync.fromPromise(
        ctx.db.transaction(async (tx) => {
          const transactionContext = { ...ctx, db: tx };

          const deletedExpenseResult =
            await TransactionQueries.hardDeleteExpense(
              expenseId,
              transactionContext,
            );
          if (deletedExpenseResult.isErr()) {
            throw deletedExpenseResult.error;
          }
          const deletedExpense = deletedExpenseResult.value;

          const budgetUpdateResult = await BudgetDomain.addToBudgetCurrentAmount(
            budget,
            parseFloat(expense.amount),
          );
          if (!budgetUpdateResult.isOk()) {
            throw budgetUpdateResult.error;
          }
          const updatedBudget = budgetUpdateResult.value;

          const encryptedBudgetResult = await BudgetDomain.encryptBudgetAmounts(updatedBudget);
          if (!encryptedBudgetResult.isOk()) {
            throw encryptedBudgetResult.error;
          }
          const encryptedBudget = encryptedBudgetResult.value;

          const finalBudgetResult = await BudgetQueries.updateBudget(
            encryptedBudget,
            transactionContext,
          );
          if (finalBudgetResult.isErr()) {
            throw finalBudgetResult.error;
          }

          return deletedExpense;
        }),
        (error) =>
          error instanceof EntityDeleteError ||
          error instanceof EntityUpdateError ||
          error instanceof EncryptionCipherCreationError ||
          error instanceof EncryptionCipherUpdateError ||
          error instanceof EncryptionCipherFinalError ||
          error instanceof EncryptionDecipherCreationError ||
          error instanceof EncryptionDecipherUpdateError ||
          error instanceof EncryptionDecipherFinalError
            ? error
            : new EntityDeleteError("Expense", error),
      ),
    ),
  );
