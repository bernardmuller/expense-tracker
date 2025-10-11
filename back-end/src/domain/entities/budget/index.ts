import { calculatePercentage } from "@/lib/utils/calculatePercentage";
import { generateUuid } from "@/lib/utils/generateUuid";
import { err, ok } from "neverthrow";
import {
  BudgetAlreadyActiveError,
  BudgetAlreadyInActiveError,
  type BudgetValidationError,
  InvalidBudgetNameError,
  InvalidStartAmountError,
} from "./budgetErrors";
import type { w } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";

export type Budget = {
  readonly id: string;
  readonly userId: string;
  name: string;
  startAmount: number;
  currentAmount: number;
  isActive: boolean;
};

export type CreateBudgetParams = Omit<
  Budget,
  "id" | "isActive" | "currentAmount"
>;

export const createBudget = (params: CreateBudgetParams) => {
  if (params.startAmount < 0)
    return err(new InvalidStartAmountError(params.startAmount));
  return ok({
    ...params,
    id: generateUuid(),
    isActive: false,
    currentAmount: params.startAmount,
  });
};

export const getBudgetSpentAmount = (budget: Budget) => {
  const spent = budget.startAmount - budget.currentAmount;
  return ok(spent);
};

export const getBudgetSpentPercentage = (budget: Budget) => {
  return calculatePercentage(
    budget.startAmount - budget.currentAmount,
    budget.startAmount,
  );
};

export const setBudgetActive = (budget: Budget) => {
  if (budget.isActive) {
    return err(new BudgetAlreadyActiveError(budget.id));
  }
  return ok({
    ...budget,
    isActive: true,
  });
};

export const setBudgetInactive = (budget: Budget) => {
  if (!budget.isActive) {
    return err(new BudgetAlreadyInActiveError(budget.id));
  }
  return ok({
    ...budget,
    isActive: false,
  });
};

export const isBudgetActive = (budget: Budget): boolean => budget.isActive;

export const isBudgetOverbudget = (budget: Budget): boolean =>
  budget.currentAmount < 0;

export const updateBudgetName = (budget: Budget, name: string) => {
  if (!name || name.trim() === "") {
    return err(new InvalidBudgetNameError(name));
  }
  return ok({
    ...budget,
    name,
  });
};

export const addToBudgetCurrentAmount = (budget: Budget, amount: number) => {
  return ok({
    ...budget,
    currentAmount: budget.currentAmount + amount,
  });
};

export const subtractFromBudgetCurrentAmount = (
  budget: Budget,
  amount: number,
) => {
  return ok({
    ...budget,
    currentAmount: budget.currentAmount - amount,
  });
};
