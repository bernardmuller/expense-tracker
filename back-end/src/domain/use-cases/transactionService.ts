import type {
  CreateTransactionParams,
  Transaction,
} from "@/domain/entities/transaction";
import type { TransactionError } from "@/domain/entities/transaction/transactionErrors";
import type {
  EntityCreateError,
  EntityNotFoundError,
  EntityUpdateError,
} from "@/lib/errors/repositoryErrors";
import type { Result } from "neverthrow";

export interface TransactionService {
  readonly createTransaction: (
    params: CreateTransactionParams,
  ) => Result<
    Transaction,
    TransactionError | InstanceType<typeof EntityCreateError>
  >;

  readonly updateTransaction: (
    transaction: Transaction,
    params: Transaction,
  ) => Result<
    Transaction,
    | TransactionError
    | InstanceType<typeof EntityUpdateError>
    | InstanceType<typeof EntityNotFoundError>
  >;

  readonly isExpenseTransaction: (
    transaction: Transaction,
  ) => Result<boolean, never>;

  readonly isIncomeTransaction: (
    transaction: Transaction,
  ) => Result<boolean, never>;
}
