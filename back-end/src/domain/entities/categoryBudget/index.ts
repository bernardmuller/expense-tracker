import { Effect } from "effect";
import {
  MissingRequiredFieldsError,
  CategoryBudgetAlreadySoftDeletedError,
  InvalidAllocatedAmountError,
} from "./categoryBudgetErrors";
import { generateUuid } from "@/lib/utils/generateUuid";
import { getCurrentISOString } from "@/lib/utils/time";

export type CategoryBudget = {
  readonly id: string;
  readonly budgetId: string;
  readonly categoryId: string;
  allocatedAmount: number;
  deletedAt?: string;
  updatedAt?: string;
};

export type CreateCategoryBudgetParams = Omit<
  CategoryBudget,
  "id" | "deletedAt" | "updatedAt"
>;

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
      deletedAt: undefined,
      updatedAt: undefined,
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

    const now = getCurrentISOString();

    return {
      ...categoryBudget,
      allocatedAmount: amount,
      updatedAt: now,
    };
  });

export const softDeleteCategoryBudget = (
  categoryBudget: CategoryBudget,
): Effect.Effect<CategoryBudget, CategoryBudgetAlreadySoftDeletedError> =>
  Effect.gen(function* () {
    if (categoryBudget.deletedAt) {
      return yield* Effect.fail(
        new CategoryBudgetAlreadySoftDeletedError({
          categoryBudgetId: categoryBudget.id,
        }),
      );
    }

    const now = getCurrentISOString();

    return {
      ...categoryBudget,
      deletedAt: now,
    };
  });

export const isCategoryBudgetSoftDeleted = (
  categoryBudget: CategoryBudget,
): boolean => !!categoryBudget.deletedAt;
