import type {
  CategoryBudget,
  CreateCategoryBudgetParams,
} from "@/domain/entities/categoryBudget";
import type { Result } from "neverthrow";
import type { CategoryBudgetError } from "../entities/categoryBudget/categoryBudgetErrors";

export interface CategoryBudgetService {
  readonly createCategoryBudget: (
    params: CreateCategoryBudgetParams,
  ) => Result<CategoryBudget, CategoryBudgetError>;
  readonly updateAllocatedAmount: (
    categoryBudget: CategoryBudget,
    amount: number,
  ) => Result<CategoryBudget, CategoryBudgetError>;
}
