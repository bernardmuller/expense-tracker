import { generateUuid } from "@/lib/utils/generateUuid";
import { err, ok } from "neverthrow";
import { InvalidAllocatedAmountError } from "./categoryBudgetErrors";

export type CategoryBudget = {
  readonly id: string;
  readonly budgetId: string;
  readonly categoryId: string;
  allocatedAmount: number;
};

export type CreateCategoryBudgetParams = Omit<CategoryBudget, "id">;

export const createCategoryBudget = (params: CreateCategoryBudgetParams) => {
  if (params.allocatedAmount < 0)
    return err(new InvalidAllocatedAmountError(params.allocatedAmount));
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
  if (amount < 0) return err(new InvalidAllocatedAmountError(amount));
  return ok({
    ...categoryBudget,
    allocatedAmount: amount,
  });
};

export const isCategoryBudgetSoftDeleted = (
  categoryBudget: CategoryBudget,
): boolean => false;
