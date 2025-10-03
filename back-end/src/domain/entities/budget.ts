import { succeed } from "effect/Exit";

export type Budget = {
  readonly id: number;
  readonly userId: string;
  name: string;
  startAmount: number;
  currentAmount: number;
  isActive: boolean;
  deletedAt?: string;
  updatedAt?: string;
};

export type CreateBudgetParams = Omit<Budget, "id" | "deletedAt" | "updatedAt" | "isActive" | "currentAmount">

export function createBudget(params: CreateBudgetParams) {
  return succeed({
    ...params
  })
}
