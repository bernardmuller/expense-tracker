import { Context, Effect } from "effect";
import type { Budget } from "@/domain/entities/budget";

export interface BudgetRepositoryShape {
  readonly create: (
    budget: Budget,
  ) => Effect.Effect<Budget, Error>;
  readonly findById: (id: string) => Effect.Effect<Budget | null, Error>;
  readonly update: (
    budget: Budget,
  ) => Effect.Effect<Budget, never>;
  readonly delete: (budget: Budget) => Effect.Effect<boolean, never>;
}

export class BudgetRepository extends Context.Tag(
  "domain/repositories/budgetRepository",
)<BudgetRepository, BudgetRepositoryShape>() {}
