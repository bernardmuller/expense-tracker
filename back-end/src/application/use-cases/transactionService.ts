import { Context, Effect, Layer, pipe } from "effect";
import type {
  CreateTransactionParams,
  Transaction,
} from "@/domain/entities/transaction";
import * as TransactionEntity from "@/domain/entities/transaction";
import { TransactionRepository } from "@/domain/repositories/transactionRepository";
import { TransactionService } from "@/domain/use-cases/transactionService";

export const TransactionServiceLive = Layer.effect(
  TransactionService,
  pipe(
    TransactionRepository,
    Effect.map((transactionRepository) => ({
      createTransaction: (params: CreateTransactionParams) =>
        pipe(
          TransactionEntity.createTransaction(params),
          Effect.andThen(transactionRepository.create),
        ),
      updateTransaction: (transaction: Transaction, params: Transaction) =>
        pipe(
          TransactionEntity.updateTransaction(transaction, params),
          // TODO: update this
          Effect.andThen(transactionRepository.update),
        ),
      isExpenseTransaction: (transaction: Transaction) =>
        Effect.succeed(TransactionEntity.isExpenseTransaction(transaction)),
      isIncomeTransaction: (transaction: Transaction) =>
        Effect.succeed(!TransactionEntity.isExpenseTransaction(transaction)),
    })),
  ),
);
