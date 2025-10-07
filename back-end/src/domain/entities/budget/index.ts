import { generateUuid } from "@/lib/utils/generateUuid";
import { Effect } from "effect";
import { fail, succeed } from "effect/Exit";
import {
  BudgetAlreadyActiveError,
  BudgetAlreadyInActiveError,
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
};

export type CreateBudgetParams = Omit<
  Budget,
  "id" | "isActive" | "currentAmount"
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

export const isBudgetSoftDeleted = (budget: Budget): boolean => false;

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
    return {
      ...budget,
      name,
    };
  });

export const addToBudgetCurrentAmount = (
  budget: Budget,
  amount: number,
): Effect.Effect<Budget, never> =>
  Effect.gen(function* () {
    return {
      ...budget,
      currentAmount: budget.currentAmount + amount,
    };
  });

export const subtractFromBudgetCurrentAmount = (
  budget: Budget,
  amount: number,
): Effect.Effect<Budget, never> =>
  Effect.gen(function* () {
    return {
      ...budget,
      currentAmount: budget.currentAmount - amount,
    };
  });
