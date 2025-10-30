import type { BudgetError, BudgetValidationError } from "@/budgets/types";
import type { CategoryValidationError } from "@/categories/types";
import type { CategoryBudgetError } from "@/category-budgets/types";
import type { TransactionError } from "@/transactions/types";
import type { UserValidationError } from "@/users/types";
import type { RepositoryErrorType } from "./repositoryErrors";
import {
  DivideByZeroError,
  InvalidDecimalNumberStringError,
  PercentageCalculationError,
} from "./utilityErrors";

export class UnexpectedError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "UnexpectedError";
  }
}

export type TUnexpectedError = InstanceType<typeof UnexpectedError>;

export type ApplicationError =
  | BudgetValidationError
  | BudgetError
  | CategoryValidationError
  | CategoryBudgetError
  | UserValidationError
  | TransactionError
  | RepositoryErrorType
  | InstanceType<typeof InvalidDecimalNumberStringError>
  | InstanceType<typeof DivideByZeroError>
  | InstanceType<typeof PercentageCalculationError>
  | TUnexpectedError;
