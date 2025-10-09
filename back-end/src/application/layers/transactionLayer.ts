import { BudgetNotActiveError } from "@/domain/entities/budget/budgetErrors";
import type {
  CreateTransactionParams,
  Transaction,
} from "@/domain/entities/transaction";
import { BudgetService } from "@/domain/use-cases/budgetService";
import { TransactionService } from "@/domain/use-cases/transactionService";
import { Effect, Layer, pipe } from "effect";
import { BudgetServiceLive } from "../use-cases/budgetService";
import { TransactionServiceLive } from "../use-cases/transactionService";

const transactionLayer = Effect.gen(function* () {
  const transactionService = yield* TransactionService;
  const budgetService = yield* BudgetService;

  return {
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
  };
});

export type TransactionLayerShape = Effect.Effect.Success<typeof transactionLayer>;

export class TransactionLayer extends Effect.Tag(
  "/application/use-cases/transactionLayer",
)<TransactionLayer, TransactionLayerShape>() {}

export const TransactionLayerLive = Layer.effect(
  TransactionLayer,
  transactionLayer,
).pipe(Layer.provide(TransactionServiceLive), Layer.provide(BudgetServiceLive));
