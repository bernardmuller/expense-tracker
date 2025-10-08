import { generateUuid } from "@/lib/utils/generateUuid";
import { Effect } from "effect";
import {
  InvalidAllocatedAmountError,
  MissingRequiredFieldsError,
} from "./categoryBudgetErrors";

export type CategoryBudget = {
  readonly id: string;
  readonly budgetId: string;
  readonly categoryId: string;
  allocatedAmount: number;
};

export type CreateCategoryBudgetParams = Omit<CategoryBudget, "id">;

export const createCategoryBudget = (
  params: CreateCategoryBudgetParams,
): Effect.Effect<
  CategoryBudget,
  MissingRequiredFieldsError | InvalidAllocatedAmountError
> =>
  Effect.gen(function* () {
    const missingFields: string[] = [];
    if (!params.budgetId) missingFields.push("budgetId");
    if (!params.categoryId) missingFields.push("categoryId");
    if (params.allocatedAmount === undefined)
      missingFields.push("allocatedAmount");

    if (missingFields.length > 0) {
      return yield* Effect.fail(
        new MissingRequiredFieldsError({
          fields: missingFields,
        }),
      );
    }

    if (params.allocatedAmount < 0) {
      return yield* Effect.fail(
        new InvalidAllocatedAmountError({
          amount: params.allocatedAmount,
        }),
      );
    }

    const uuid = generateUuid();

    return {
      ...params,
      id: uuid,
    };
  });

export const updateAllocatedAmount = (
  categoryBudget: CategoryBudget,
  amount: number,
): Effect.Effect<CategoryBudget, InvalidAllocatedAmountError> =>
  Effect.gen(function* () {
    if (amount < 0) {
      return yield* Effect.fail(
        new InvalidAllocatedAmountError({
          amount,
        }),
      );
    }

    return {
      ...categoryBudget,
      allocatedAmount: amount,
    };
  });

export const isCategoryBudgetSoftDeleted = (
  categoryBudget: CategoryBudget,
): boolean => false;
