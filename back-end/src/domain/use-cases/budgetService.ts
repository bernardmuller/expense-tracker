import type { Budget, CreateBudgetParams } from "@/domain/entities/budget";
import type {
  BudgetAlreadyActiveError,
  BudgetAlreadyInActiveError,
  BudgetNotFoundError,
  BudgetValidationError,
} from "@/domain/entities/budget/budgetErrors";
import type { PercentageCalculationError } from "@/lib/utils/calculatePercentage";
import { Context, Effect } from "effect";

export interface BudgetServiceShape {
  readonly createBudget: (
    params: CreateBudgetParams,
  ) => Effect.Effect<Budget, BudgetValidationError>;
  readonly getBudgetById: (
    id: string,
  ) => Effect.Effect<Budget, BudgetNotFoundError>;
  readonly getBudgetSpentAmount: (
    budget: Budget,
  ) => Effect.Effect<number, BudgetValidationError>;
  readonly getBudgetSpentPercentage: (
    budget: Budget,
  ) => Effect.Effect<
    string,
    BudgetValidationError | PercentageCalculationError
  >;
  readonly setBudgetActive: (
    budget: Budget,
  ) => Effect.Effect<Budget, BudgetAlreadyActiveError>;
  readonly setBudgetInactive: (
    budget: Budget,
  ) => Effect.Effect<Budget, BudgetAlreadyInActiveError>;
  readonly isBudgetActive: (budget: Budget) => boolean;
  readonly isBudgetOverbudget: (budget: Budget) => boolean;
  readonly updateBudgetName: (
    Budget: Budget,
    params: Budget,
  ) => Effect.Effect<Budget, BudgetValidationError>;
  readonly addToBudgetCurrentAmount: (
    Budget: Budget,
    amount: number,
  ) => Effect.Effect<Budget, never>;
  readonly subtractFromBudgetCurrentAmount: (
    Budget: Budget,
    amount: number,
  ) => Effect.Effect<Budget, never>;
}

export class BudgetService extends Context.Tag(
  "domain/use-cases/budgetService",
)<BudgetService, BudgetServiceShape>() {}
