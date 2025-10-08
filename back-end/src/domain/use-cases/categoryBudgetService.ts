import type {
  CategoryBudget,
  CreateCategoryBudgetParams,
} from "@/domain/entities/categoryBudget";
import type {
  InvalidAllocatedAmountError,
  MissingRequiredFieldsError,
} from "@/domain/entities/categoryBudget/categoryBudgetErrors";
import { Context, Effect } from "effect";

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
