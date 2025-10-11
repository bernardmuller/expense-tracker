import { Context } from "effect";
import type { Budget } from "@/domain/entities/budget";
import type { BaseRepositoryShape } from "./baseRepository";

export interface BudgetRepositoryShape extends BaseRepositoryShape<Budget> {}

export class BudgetRepository extends Context.Tag(
  "domain/repositories/budgetRepository",
)<BudgetRepository, BudgetRepositoryShape>() {}
