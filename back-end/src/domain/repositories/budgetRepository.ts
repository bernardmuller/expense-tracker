import { Context, Effect } from "effect";
import type { Budget } from "@/domain/entities/budget";
import type {
  BudgetNotFoundError,
  BudgetValidationError,
} from "../entities/budget/budgetErrors";

export interface BudgetRepositoryShape {
  readonly create: (
    budget: Budget,
  ) => Effect.Effect<Budget, never>;
  readonly findById: (id: string) => Effect.Effect<Budget, BudgetNotFoundError>;
  readonly update: (
    budget: Budget,
  ) => Effect.Effect<Budget, never>;
  readonly delete: (budget: Budget) => Effect.Effect<boolean, never>;
}

export class BudgetRepository extends Context.Tag(
  "domain/repositories/budgetRepository",
)<BudgetRepository, BudgetRepositoryShape>() {}
