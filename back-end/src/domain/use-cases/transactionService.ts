import { Context, Effect } from "effect";
import type {
  CreateTransactionParams,
  Transaction,
} from "@/domain/entities/transaction";
import type { TransactionError } from "@/domain/entities/transaction/transactionErrors";

export interface TransactionServiceShape {
  readonly createTransaction: (
    params: CreateTransactionParams,
  ) => Effect.Effect<Transaction, TransactionError>;
  readonly updateTransaction: (
    transaction: Transaction,
    params: Transaction,
  ) => Effect.Effect<Transaction, TransactionError>;
}

export class TransactionService extends Context.Tag(
  "domain/use-cases/transactionService",
)<TransactionService, TransactionServiceShape>() {}
