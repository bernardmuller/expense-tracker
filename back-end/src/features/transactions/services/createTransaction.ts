import { ResultAsync } from "neverthrow";
import type { AppContext } from "@/lib/db/context";
import * as TransactionRepo from "../queries/index";
import * as TransactionDomain from "../actions/index";
import * as BudgetDomain from "../../budgets/domain/budget-processing.domain";
import * as BudgetRepo from "../../budgets/queries/index";
import type { CreateTransactionParams, Transaction } from "../types";
import { AppResult } from "@/lib/result";
import { DatabaseError } from "@/lib/errors/domain";

export const createTransaction = (
  budgetId: string,
  params: CreateTransactionParams,
  ctx: AppContext,
): AppResult<Transaction> =>
  BudgetRepo.findBudgetById(budgetId, ctx).andThen((budget) =>
    TransactionRepo.findCategoryById(params.categoryId, ctx).andThen(() =>
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

          const createdTransactionResult = await TransactionRepo.create(
            transaction,
            transactionContext,
          );
          if (createdTransactionResult.isErr()) {
            throw createdTransactionResult.error;
          }
          const createdTransaction = createdTransactionResult.value;

          const decryptedBudgetResult =
            await BudgetDomain.decryptBudgetAmounts(budget);
          if (!decryptedBudgetResult.isOk()) {
            throw decryptedBudgetResult.error;
          }
          const decryptedBudget = decryptedBudgetResult.value;

          const updatedAmountResult =
            await BudgetDomain.subtractFromBudgetCurrentAmount(
              {
                ...budget,
                currentAmount: decryptedBudget.currentAmount,
                startAmount: decryptedBudget.startAmount,
              },
              params.amount,
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

          return createdTransaction;
        }),
        (error) => new DatabaseError(String(error)),
      ),
    ),
  );
