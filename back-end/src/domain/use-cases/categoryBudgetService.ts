import { Context, Effect } from "effect";
import type {
  CreateCategoryBudgetParams,
  CategoryBudget,
} from "@/domain/entities/categoryBudget";
import type {
  InvalidAllocatedAmountError,
  MissingRequiredFieldsError,
} from "@/domain/entities/categoryBudget/categoryBudgetErrors";

export interface CategoryBudgetServiceShape {
  readonly createCategoryBudget: (
    params: CreateCategoryBudgetParams,
  ) => Effect.Effect<
    CategoryBudget,
    MissingRequiredFieldsError | InvalidAllocatedAmountError
  >;
  readonly updateAllocatedAmount: (
    categoryBudget: CategoryBudget,
    amount: number,
  ) => Effect.Effect<CategoryBudget, InvalidAllocatedAmountError>;
}

export class CategoryBudgetService extends Context.Tag(
  "domain/use-cases/categoryBudgetService",
)<CategoryBudgetService, CategoryBudgetServiceShape>() {}
