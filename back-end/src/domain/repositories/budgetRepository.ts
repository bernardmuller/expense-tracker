import { Context, Effect } from "effect";
import type { Budget } from "@/domain/entities/budget";
import type { BaseRepositoryShape } from "./baseRepository";

export interface BudgetRepositoryShape
  extends BaseRepositoryShape<Budget, never, never, never, never> {}

export class BudgetRepository extends Context.Tag(
  "domain/repositories/budgetRepository",
)<BudgetRepository, BudgetRepositoryShape>() {}
