import { generateUuid } from "@/lib/utils/generateUuid";
import { getCurrentISOString } from "@/lib/utils/time";
import { Effect } from "effect";
import { fail, succeed } from "effect/Exit";
import {
  BudgetAlreadyActiveError,
  BudgetAlreadyInActiveError,
  BudgetAlreadySoftDeletedError,
  InvalidStartAmountError,
  MissingRequiredFieldsError,
  type BudgetValidationError,
} from "./budget-errors";
import { calculatePercentage } from "@/lib/utils/calculatePercentage";

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

export type CreateBudgetParams = Omit<
  Budget,
  "id" | "deletedAt" | "updatedAt" | "isActive" | "currentAmount"
>;

export function createBudget(params: CreateBudgetParams) {
  return Effect.gen(function* () {
    const missingFields: string[] = [];
    if (!params.userId) missingFields.push("userId");
    if (!params.name) missingFields.push("name");
    if (params.startAmount === undefined) missingFields.push("startAmount");

    if (missingFields.length > 0) {
      return yield* Effect.fail(
        new MissingRequiredFieldsError({
          fields: missingFields,
        }),
      );
    }

    if (params.startAmount < 0) {
      return yield* Effect.fail(
        new InvalidStartAmountError({ amount: params.startAmount }),
      );
    }

    const uuid = yield* Effect.sync(() => generateUuid());

    return {
      ...params,
      id: uuid,
      isActive: false,
      currentAmount: params.startAmount,
      deletedAt: undefined,
      updatedAt: undefined,
    };
  });
}

export function getBudgetSpentAmount(budget: Budget) {
  return Effect.gen(function* () {
    const missingFields: string[] = [];
    if (!budget.startAmount) missingFields.push("startAmount");
    if (!budget.currentAmount) missingFields.push("currentAmount");

    if (missingFields.length > 0)
      return yield* Effect.fail(
        new MissingRequiredFieldsError({
          fields: missingFields,
        }),
      );

    const spent = yield* Effect.sync(
      () => budget.startAmount - budget.currentAmount,
    );

    return spent;
  });
}

export function getBudgetSpentPercentage(budget: Budget) {
  return Effect.gen(function* () {
    const missingFields: string[] = [];
    if (!budget.startAmount) missingFields.push("startAmount");
    if (!budget.currentAmount) missingFields.push("currentAmount");

    if (missingFields.length > 0)
      return yield* Effect.fail(
        new MissingRequiredFieldsError({
          fields: missingFields,
        }),
      );

    const percentage = yield* calculatePercentage(
      budget.startAmount - budget.currentAmount,
      budget.startAmount,
    );

    return percentage;
  });
}

export function setBudgetActive(budget: Budget) {
  return Effect.gen(function* () {
    if (budget.isActive)
      return yield* Effect.fail(
        new BudgetAlreadyActiveError({
          budgetId: budget.id,
        }),
      );
    return {
      ...budget,
      isActive: true,
    };
  });
}

export function setBudgetInactive(budget: Budget) {
  return Effect.gen(function* () {
    if (!budget.isActive)
      return yield* Effect.fail(
        new BudgetAlreadyInActiveError({
          budgetId: budget.id,
        }),
      );
    return {
      ...budget,
      isActive: false,
    };
  });
}

export function isBudgetActive(budget: Budget) {
  return budget.isActive;
}

export function isBudgetOverbudget(budget: Budget) {
  return budget.currentAmount < 0;
}

export function isBudgetSoftDeleted(budget: Budget) {
  return !!budget.deletedAt;
}

export function softDeleteBudget(budget: Budget) {
  return Effect.gen(function* () {
    if (budget.deletedAt) {
      return yield* Effect.fail(
        new BudgetAlreadySoftDeletedError({
          budgetId: budget.id,
        }),
      );
    }
    const now = yield* getCurrentISOString;
    return {
      ...budget,
      deletedAt: now,
    };
  });
}

export function updateBudgetName(budget: Budget, name: string) {
  return Effect.gen(function* () {
    const now = yield* getCurrentISOString;
    return {
      ...budget,
      name,
      updatedAt: now,
    };
  });
}

export function addToBudgetCurrentAmount(budget: Budget, amount: number) {
  return Effect.gen(function* () {
    const now = yield* getCurrentISOString;
    return {
      ...budget,
      currentAmount: budget.currentAmount + amount,
      updatedAt: now,
    };
  });
}

export function subtractFromBudgetCurrentAmount(
  budget: Budget,
  amount: number,
) {
  return Effect.gen(function* () {
    const now = yield* getCurrentISOString;
    return {
      ...budget,
      currentAmount: budget.currentAmount - amount,
      updatedAt: now,
    };
  });
}
