import { Effect, Layer } from "effect";
import { TransactionRepository } from "@/domain/repositories/transactionRepository";
import type { Transaction } from "@/domain/entities/transaction";

export const InMemoryTransactionRepository = Layer.succeed(
  TransactionRepository,
  (() => {
    const store = new Map<string, Transaction>();

    return TransactionRepository.of({
      create: (transaction) =>
        Effect.sync(() => {
          store.set(transaction.id, transaction);
          return transaction;
        }),

      findById: (id) =>
        Effect.sync(() => {
          return store.get(id) ?? null;
        }),
    });
  })(),
);
