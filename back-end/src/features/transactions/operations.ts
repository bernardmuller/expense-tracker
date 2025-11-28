import { ResultAsync, okAsync, errAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as TransactionQueries from "./queries";
import * as TransactionDomain from "./actions";
import type {
  CreateTransactionParams,
  Transaction,
  BudgetNotFoundError,
  CategoryNotFoundError,
} from "./types";
import type { Budget } from "@/lib/db/schema";
import {
  EntityCreateError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/lib/errors/actionErrors";

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
> =>
  TransactionQueries.findBudgetById(budgetId, ctx).andThen((budget) =>
    TransactionQueries.findCategoryById(params.categoryId, ctx).andThen(() =>
      ResultAsync.fromPromise(
        ctx.db.transaction(async (tx) => {
          const transactionContext = { ...ctx, db: tx };

          const transactionResult = TransactionDomain.createTransaction(budgetId, params);
          if (!transactionResult.isOk()) {
            throw new Error("Transaction creation failed");
          }
          const transaction = transactionResult.value;

          const createdTransactionResult = await TransactionQueries.create(transaction, transactionContext);
          if (createdTransactionResult.isErr()) {
            throw createdTransactionResult.error;
          }
          const createdTransaction = createdTransactionResult.value;

          const budgetUpdateResult = TransactionDomain.updateBudgetAfterTransaction(budget, params.amount);
          if (!budgetUpdateResult.isOk()) {
            throw new Error("Budget update failed");
          }
          const updatedBudget = budgetUpdateResult.value;

          const finalBudgetResult = await TransactionQueries.updateBudget(updatedBudget, transactionContext);
          if (finalBudgetResult.isErr()) {
            throw finalBudgetResult.error;
          }

          return createdTransaction;
        }),
        (error) =>
          error instanceof EntityCreateError ||
          error instanceof EntityUpdateError
            ? error
            : new EntityCreateError("Transaction", error),
      ),
    ),
  );

export const getActiveBudgetWithExpenses = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  Budget & {
    expenses: (Transaction & {
      category: { id: string; key: string; label: string; icon: string };
    })[];
  },
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
> => TransactionQueries.getActiveBudgetByUserId(userId, ctx);

export const getUserCategories = (
  userId: string,
  ctx: AppContext,
): ResultAsync<
  Array<{ id: string; key: string; label: string; icon: string }>,
  InstanceType<typeof EntityReadError>
> => TransactionQueries.getUserCategories(userId, ctx);
