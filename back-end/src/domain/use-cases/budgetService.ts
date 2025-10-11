import type { Budget, CreateBudgetParams } from "@/domain/entities/budget";
import type {
  BudgetAlreadyActiveError,
  BudgetAlreadyInActiveError,
  BudgetNotFoundError,
  BudgetValidationError,
} from "@/domain/entities/budget/budgetErrors";
import type { PercentageCalculationError } from "@/lib/utils/calculatePercentage";
import type {
  EntityCreateError,
  EntityNotFoundError,
  EntityReadError,
  EntityUpdateError,
} from "@/domain/errors/repositoryErrors";
import type { ReadParams } from "@/domain/repositories/baseRepository";
import { Context, Effect } from "effect";

export interface BudgetServiceShape {
  readonly createBudget: (params: CreateBudgetParams) => Effect.Effect<Budget>;
  readonly getAllBudgets: (
    params?: ReadParams<Budget>,
  ) => Effect.Effect<Budget[]>;
  readonly getBudgetById: (id: string) => Effect.Effect<Budget>;
  readonly getBudgetSpentAmount: (budget: Budget) => Effect.Effect<number>;
  readonly getBudgetSpentPercentage: (budget: Budget) => Effect.Effect<string>;
  readonly setBudgetActive: (budget: Budget) => Effect.Effect<Budget>;
  readonly setBudgetInactive: (budget: Budget) => Effect.Effect<Budget>;
  readonly isBudgetActive: (budget: Budget) => boolean;
  readonly isBudgetOverbudget: (budget: Budget) => boolean;
  readonly updateBudgetName: (
    Budget: Budget,
    params: Budget,
  ) => Effect.Effect<Budget>;
  readonly addToBudgetCurrentAmount: (
    Budget: Budget,
    amount: number,
  ) => Effect.Effect<Budget>;
  readonly subtractFromBudgetCurrentAmount: (
    Budget: Budget,
    amount: number,
  ) => Effect.Effect<Budget>;
}

export class BudgetService extends Context.Tag(
  "domain/use-cases/budgetService",
)<BudgetService, BudgetServiceShape>() {}
