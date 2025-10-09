import { Context, Effect, Layer } from "effect";
import type {
  CreateTransactionParams,
  Transaction,
} from "@/domain/entities/transaction";
import * as TransactionEntity from "@/domain/entities/transaction";
import { TransactionRepository } from "@/domain/repositories/transactionRepository";
import { TransactionService } from "@/domain/use-cases/transactionService";

export const TransactionServiceLive = Layer.effect(
  TransactionService,
  Effect.gen(function* () {
    const transactionRepository = yield* TransactionRepository;

    return {
      createTransaction: (params: CreateTransactionParams) =>
        Effect.gen(function* () {
          const transaction =
            yield* TransactionEntity.createTransaction(params);
          return yield* transactionRepository.create(transaction);
        }),

      updateTransaction: (transaction: Transaction, params: Transaction) =>
        Effect.gen(function* () {
          const updatedTransaction = yield* TransactionEntity.updateTransaction(
            transaction,
            params,
          );
          return yield* transactionRepository.create(updatedTransaction);
        }),
    };
  }),
);
