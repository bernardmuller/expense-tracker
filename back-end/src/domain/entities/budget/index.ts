import { generateUuid } from "@/lib/utils/generateUuid";
import { getCurrentISOString } from "@/lib/utils/time";
import { Effect } from "effect";
import { fail, succeed } from "effect/Exit";
import {
  BudgetAlreadyActiveError,
  BudgetAlreadyInActiveError,
  BudgetAlreadySoftDeletedError,
  InvalidBudgetNameError,
  InvalidStartAmountError,
  MissingRequiredFieldsError,
  type BudgetValidationError,
} from "./budgetErrors";
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

export const createBudget = (
  params: CreateBudgetParams,
): Effect.Effect<
  Budget,
  MissingRequiredFieldsError | InvalidStartAmountError
> =>
  Effect.gen(function* () {
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

export const getBudgetSpentAmount = (
  budget: Budget,
): Effect.Effect<number, MissingRequiredFieldsError> =>
  Effect.gen(function* () {
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

export const getBudgetSpentPercentage = (budget: Budget) =>
  Effect.gen(function* () {
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

export const setBudgetActive = (
  budget: Budget,
): Effect.Effect<Budget, BudgetAlreadyActiveError> =>
  Effect.gen(function* () {
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

export const setBudgetInactive = (
  budget: Budget,
): Effect.Effect<Budget, BudgetAlreadyInActiveError> =>
  Effect.gen(function* () {
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

export const isBudgetActive = (budget: Budget): boolean => budget.isActive;

export const isBudgetOverbudget = (budget: Budget): boolean =>
  budget.currentAmount < 0;

export const isBudgetSoftDeleted = (budget: Budget): boolean =>
  !!budget.deletedAt;

export const softDeleteBudget = (
  budget: Budget,
): Effect.Effect<Budget, BudgetAlreadySoftDeletedError> =>
  Effect.gen(function* () {
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

export const updateBudgetName = (
  budget: Budget,
  name: string,
): Effect.Effect<Budget, InvalidBudgetNameError> =>
  Effect.gen(function* () {
    if (!name || name.trim() === "") {
      return yield* Effect.fail(
        new InvalidBudgetNameError({
          name,
        }),
      );
    }
    const now = yield* getCurrentISOString;
    return {
      ...budget,
      name,
      updatedAt: now,
    };
  });

export const addToBudgetCurrentAmount = (
  budget: Budget,
  amount: number,
): Effect.Effect<Budget, never> =>
  Effect.gen(function* () {
    const now = yield* getCurrentISOString;
    return {
      ...budget,
      currentAmount: budget.currentAmount + amount,
      updatedAt: now,
    };
  });

export const subtractFromBudgetCurrentAmount = (
  budget: Budget,
  amount: number,
): Effect.Effect<Budget, never> =>
  Effect.gen(function* () {
    const now = yield* getCurrentISOString;
    return {
      ...budget,
      currentAmount: budget.currentAmount - amount,
      updatedAt: now,
    };
  });
