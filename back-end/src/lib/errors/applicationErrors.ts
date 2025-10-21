import type { BudgetError, BudgetValidationError } from "@/domain/entities/budget/budgetErrors";
import type { CategoryValidationError } from "@/domain/entities/category/categoryErrors";
import type { CategoryBudgetError } from "@/domain/entities/categoryBudget/categoryBudgetErrors";
import type { FinancialAccountValidationError } from "@/domain/entities/financialAccount/financialAccountErrors";
import type { TransactionError } from "@/domain/entities/transaction/transactionErrors";
import type { UserValidationError } from "@/domain/entities/user/userErrors";
import type { UserCategoryError } from "@/domain/entities/userCategory/userCategoryErrors";
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
  | FinancialAccountValidationError
  | CategoryBudgetError
  | UserValidationError
  | TransactionError
  | UserCategoryError
  | RepositoryErrorType
  | InstanceType<typeof InvalidDecimalNumberStringError>
  | InstanceType<typeof DivideByZeroError>
  | InstanceType<typeof PercentageCalculationError>
  | TUnexpectedError;
