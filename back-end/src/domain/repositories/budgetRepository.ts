import { Context, Effect } from "effect";
import type { Budget, CreateBudgetParams } from "@/domain/entities/budget";

export interface BudgetRepositoryShape {
  readonly create: (params: CreateBudgetParams) => Effect.Effect<Budget, Error>;
  readonly findById: (id: string) => Effect.Effect<Budget | null, Error>;
  readonly update: (budget: Budget) => Effect.Effect<Budget, Error>;
}

export class BudgetRepository extends Context.Tag(
  "domain/repositories/budgetRepository",
)<BudgetRepository, BudgetRepositoryShape>() {}
