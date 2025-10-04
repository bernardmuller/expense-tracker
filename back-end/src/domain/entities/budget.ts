import { CreateBudgetError, ValidationError } from "@/lib/errors";
import { generateUuid } from "@/lib/utils/generateUuid";
import type { Effect } from "effect";
import { fail, succeed } from "effect/Exit";

export type Budget = {
  readonly id: string;
  readonly userId: string;
  name: string;
  startAmount: number;
  currentAmount: number;
  isActive: boolean;
  deletedAt?: string;
  updatedAt?: string;
};

export type CreateBudgetParams = Omit<Budget, "id" | "deletedAt" | "updatedAt" | "isActive" | "currentAmount">

export function createBudget(params: CreateBudgetParams): Effect.Effect<Budget, ValidationError> {
  if (!params.userId || !params.startAmount || !params.name) {
    return fail(new ValidationError({ message: "userId, startAmount and name is required" }))
  }
  return succeed({
    ...params,
    id: generateUuid(),
    isActive: false,
    currentAmount: params.startAmount,
    deletedAt: undefined,
    updatedAt: undefined
  })
}

export function getBudgetSpentAmount(budget: Budget): Effect.Effect<number, ValidationError> {
  if (!budget.startAmount || !budget.currentAmount) return fail(new ValidationError({ message: 'unable to calculate budget spent amount, no startAmount or currentAmount found' }))
  const spent = budget.startAmount - budget.currentAmount;
  return succeed(spent)
}

export function getBudgetSpentPercentage(budget: Budget): Effect.Effect<string, ValidationError> {
  if (!budget.startAmount || !budget.currentAmount) return fail(new ValidationError({ message: 'unable to calculate budget spent percentage, no startAmount or currentAmount found' }))
  const percentage = ((budget.startAmount - budget.currentAmount) / budget.startAmount * 100).toFixed(1);
  return succeed(percentage)
}

export function setBudgetActive(budget: Budget): Effect.Effect<Budget, ValidationError> {
  if (budget.isActive) return fail(new ValidationError({ message: 'budget is already active', entityId: budget.id }))
  return succeed({
    ...budget,
    isActive: true
  })
}

export function isBudgetActive(budget: Budget): Effect.Effect<boolean, never> {
  return succeed(budget.isActive)
}

export function isBudgetOverbudget(budget: Budget): Effect.Effect<boolean, never> {
  return succeed(budget.currentAmount < 0)
}
