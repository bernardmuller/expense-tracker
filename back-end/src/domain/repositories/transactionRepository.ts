import { Context, Effect } from "effect";
import type { Transaction } from "@/domain/entities/transaction";

export interface TransactionRepositoryShape {
  readonly create: (
    transaction: Transaction,
  ) => Effect.Effect<Transaction, Error>;
  readonly findById: (id: string) => Effect.Effect<Transaction | null, Error>;
  readonly update: (
    transaction: Transaction,
  ) => Effect.Effect<Transaction, never>;
  readonly delete: (transaction: Transaction) => Effect.Effect<boolean, never>;
}

export class TransactionRepository extends Context.Tag(
  "domain/repositories/transactionRepository",
)<TransactionRepository, TransactionRepositoryShape>() {}
