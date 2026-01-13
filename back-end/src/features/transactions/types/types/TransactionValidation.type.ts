import type { BudgetNotFoundError, CategoryNotFoundError, InvalidTransactionAmountError } from "../errors";

export type TransactionValidationError =
  | InstanceType<typeof BudgetNotFoundError>
  | InstanceType<typeof CategoryNotFoundError>
  | InstanceType<typeof InvalidTransactionAmountError>;
