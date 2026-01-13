import { ResultAsync, okAsync, errAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as TransactionQueries from "./queries";
import * as TransactionDomain from "./actions";
import * as BudgetDomain from "../budgets/actions";
import * as BudgetQueries from "../budgets/queries";
import type {
  CreateTransactionParams,
  Transaction,
  BudgetNotFoundError,
  CategoryNotFoundError,
} from "./types";
import {
  EntityCreateError,
  EntityDeleteError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";
import { SearchQueries } from "@/lib/http/types";
import {
  EncryptionCipherCreationError,
  EncryptionCipherUpdateError,
  EncryptionCipherFinalError,
  EncryptionDecipherCreationError,
  EncryptionDecipherUpdateError,
  EncryptionDecipherFinalError,
} from "@/lib/utils/encryption";

export const createTransaction = (
  budgetId: string,
  params: CreateTransactionParams,
  ctx: AppContext,
): ResultAsync<
  Transaction,
  | InstanceType<typeof BudgetNotFoundError>
  | InstanceType<typeof CategoryNotFoundError>
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof EntityCreateError>
  | InstanceType<typeof EntityUpdateError>
  | InstanceType<typeof EncryptionCipherCreationError>
  | InstanceType<typeof EncryptionCipherUpdateError>
  | InstanceType<typeof EncryptionCipherFinalError>
  | InstanceType<typeof EncryptionDecipherCreationError>
  | InstanceType<typeof EncryptionDecipherUpdateError>
  | InstanceType<typeof EncryptionDecipherFinalError>
> =>
  BudgetQueries.findBudgetById(budgetId, ctx).andThen((budget) =>
    TransactionQueries.findCategoryById(params.categoryId, ctx).andThen(() =>
      ResultAsync.fromPromise(
        ctx.db.transaction(async (tx) => {
          const transactionContext = { ...ctx, db: tx };

          const transactionResult = TransactionDomain.createTransaction(
            budgetId,
            params,
          );
          if (!transactionResult.isOk()) {
            throw new Error("Transaction creation failed");
          }
          const transaction = transactionResult.value;

          const createdTransactionResult = await TransactionQueries.create(
            transaction,
            transactionContext,
          );
          if (createdTransactionResult.isErr()) {
            throw createdTransactionResult.error;
          }
          const createdTransaction = createdTransactionResult.value;

          const budgetUpdateResult = await BudgetDomain.subtractFromBudgetCurrentAmount(budget, params.amount);
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

          return createdTransaction;
        }),
        (error) =>
          error instanceof EntityCreateError ||
          error instanceof EntityUpdateError ||
          error instanceof EncryptionCipherCreationError ||
          error instanceof EncryptionCipherUpdateError ||
          error instanceof EncryptionCipherFinalError ||
          error instanceof EncryptionDecipherCreationError ||
          error instanceof EncryptionDecipherUpdateError ||
          error instanceof EncryptionDecipherFinalError
            ? error
            : new EntityCreateError("Transaction", error),
      ),
    ),
  );

export const getTransactions = (
  search: SearchQueries<
    Transaction,
    {
      budgetId: string;
      categoryId: string;
      userId: string;
      description: string;
    }
  >,
  ctx: AppContext,
): ResultAsync<Array<Transaction>, InstanceType<typeof EntityReadError>> =>
  TransactionQueries.getTransactions(search, ctx);

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
