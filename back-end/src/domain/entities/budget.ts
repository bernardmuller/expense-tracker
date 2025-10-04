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
