import type {
  CreateTransactionParams,
  Transaction,
} from "@/domain/entities/transaction";
import type { TransactionError } from "@/domain/entities/transaction/transactionErrors";
import type {
  EntityCreateError,
  EntityNotFoundError,
  EntityUpdateError,
} from "@/domain/errors/repositoryErrors";
import { Context, Effect } from "effect";

export interface TransactionServiceShape {
  // createTransaction can fail with validation errors OR repository errors (auto-propagated)
  readonly createTransaction: (
    params: CreateTransactionParams,
  ) => Effect.Effect<Transaction, TransactionError | EntityCreateError>;

  // updateTransaction can fail with validation errors OR update/not-found errors (auto-propagated)
  readonly updateTransaction: (
    transaction: Transaction,
    params: Transaction,
  ) => Effect.Effect<Transaction, TransactionError | EntityUpdateError | EntityNotFoundError>;

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
