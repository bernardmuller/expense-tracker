import type {
  CreateTransactionParams,
  Transaction,
} from "@/domain/entities/transaction";
import type { TransactionError } from "@/domain/entities/transaction/transactionErrors";
import { Context, Effect } from "effect";

export interface TransactionServiceShape {
  readonly createTransaction: (
    params: CreateTransactionParams,
  ) => Effect.Effect<Transaction, TransactionError | Error>;
  readonly updateTransaction: (
    transaction: Transaction,
    params: Transaction,
  ) => Effect.Effect<Transaction, TransactionError | Error>;
  readonly isExpenseTransaction: (
    transaction: Transaction,
  ) => Effect.Effect<boolean, never>;
  readonly isIncomeTransaction: (
    transaction: Transaction,
  ) => Effect.Effect<boolean, never>;
}

export class TransactionService extends Context.Tag(
  "domain/use-cases/transactionService",
)<TransactionService, TransactionServiceShape>() {}
