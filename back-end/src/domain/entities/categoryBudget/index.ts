import { generateUuid } from "@/lib/utils/generateUuid";
import { err, ok } from "neverthrow";
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

export const createCategoryBudget = (params: CreateCategoryBudgetParams) => {
  const missingFields: string[] = [];
  if (!params.budgetId) missingFields.push("budgetId");
  if (!params.categoryId) missingFields.push("categoryId");
  if (params.allocatedAmount === undefined)
    missingFields.push("allocatedAmount");

  if (missingFields.length > 0) {
    return err(
      new MissingRequiredFieldsError({
        fields: missingFields,
      }),
    );
  }

  if (params.allocatedAmount < 0) {
    return err(
      new InvalidAllocatedAmountError({
        amount: params.allocatedAmount,
      }),
    );
  }

  const uuid = generateUuid();

  return ok({
    ...params,
    id: uuid,
  });
};

export const updateAllocatedAmount = (
  categoryBudget: CategoryBudget,
  amount: number,
) => {
  if (amount < 0) {
    return err(
      new InvalidAllocatedAmountError({
        amount,
      }),
    );
  }

  return ok({
    ...categoryBudget,
    allocatedAmount: amount,
  });
};

export const isCategoryBudgetSoftDeleted = (
  categoryBudget: CategoryBudget,
): boolean => false;
