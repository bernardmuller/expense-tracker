import type { Budget, CreateBudgetParams } from "@/domain/entities/budget";
import type { ReadParams } from "@/domain/repositories/baseRepository";
import { Result } from "neverthrow";
import type { BudgetError } from "../entities/budget/budgetErrors";

export interface BudgetService {
  readonly createBudget: (
    params: CreateBudgetParams,
  ) => Result<Budget, BudgetError>;
  readonly getAllBudgets: (
    params?: ReadParams<Budget>,
  ) => Result<Budget[], never>;
  readonly getBudgetById: (id: string) => Result<Budget, BudgetError>;
  readonly getBudgetSpentAmount: (
    budget: Budget,
  ) => Result<number, BudgetError>;
  readonly getBudgetSpentPercentage: (
    budget: Budget,
  ) => Result<string, BudgetError>;
  readonly setBudgetActive: (budget: Budget) => Result<Budget, BudgetError>;
  readonly setBudgetInactive: (budget: Budget) => Result<Budget, BudgetError>;
  readonly isBudgetActive: (budget: Budget) => Result<boolean, never>;
  readonly isBudgetOverbudget: (budget: Budget) => Result<boolean, never>;
  readonly updateBudgetName: (
    Budget: Budget,
    params: Budget,
  ) => Result<Budget, BudgetError>;
  readonly addToBudgetCurrentAmount: (
    Budget: Budget,
    amount: number,
  ) => Result<Budget, BudgetError>;
  readonly subtractFromBudgetCurrentAmount: (
    Budget: Budget,
    amount: number,
  ) => Result<Budget, BudgetError>;
}
