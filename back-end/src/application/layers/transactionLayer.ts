import {
  BudgetNotActiveError,
  BudgetNotFoundError,
} from "@/domain/entities/budget/budgetErrors";
import type {
  CreateTransactionParams,
  Transaction,
} from "@/domain/entities/transaction";
import type { TransactionError } from "@/domain/entities/transaction/transactionErrors";
import { BudgetService } from "@/domain/use-cases/budgetService";
import { TransactionService } from "@/domain/use-cases/transactionService";
import { Effect, Layer, pipe } from "effect";
import { BudgetServiceLive } from "../use-cases/budgetService";
import { TransactionServiceLive } from "../use-cases/transactionService";
import type {
  EntityCreateError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/domain/errors/repositoryErrors";

export interface TransactionLayerShape {
  readonly createTransaction: (
    params: CreateTransactionParams,
  ) => Effect.Effect<
    Transaction,
    | TransactionError
    | EntityCreateError
    | EntityUpdateError
    | EntityNotFoundError
    | EntityReadError
    | BudgetNotActiveError
    | BudgetNotFoundError
  >;
}

const transactionLayer = pipe(
  Effect.all([TransactionService, BudgetService]),
  Effect.map(([transactionService, budgetService]) => ({
    createTransaction: (params: CreateTransactionParams) =>
      pipe(
        budgetService.getBudgetById(params.budgetId),
        Effect.flatMap((budget) =>
          !budgetService.isBudgetActive(budget)
            ? Effect.fail(new BudgetNotActiveError({ id: budget.id }))
            : Effect.succeed(budget),
        ),
        Effect.flatMap((budget) =>
          pipe(
            transactionService.createTransaction(params),
            Effect.map((transaction) => ({ budget, transaction })),
          ),
        ),
        Effect.flatMap(({ budget, transaction }) =>
          pipe(
            transactionService.isExpenseTransaction(transaction)
              ? budgetService.subtractFromBudgetCurrentAmount(
                  budget,
                  transaction.amount,
                )
              : budgetService.addToBudgetCurrentAmount(
                  budget,
                  transaction.amount,
                ),
            Effect.map(() => transaction),
          ),
        ),
      ),
  })),
);

export class TransactionLayer extends Effect.Tag(
  "/application/use-cases/transactionLayer",
)<TransactionLayer, TransactionLayerShape>() {}

export const TransactionLayerLive = Layer.effect(
  TransactionLayer,
  transactionLayer,
).pipe(Layer.provide(TransactionServiceLive), Layer.provide(BudgetServiceLive));
